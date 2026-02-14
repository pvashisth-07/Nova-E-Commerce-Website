import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id;
        const itemsJson = session.metadata?.items;

        if (!userId || !itemsJson) {
            console.error("Missing metadata in Stripe session");
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const items = JSON.parse(itemsJson) as {
            product_id: string;
            price: number;
            quantity: number;
        }[];

        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const supabase = createAdminClient();

        // Create order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: userId,
                status: "processing",
                total,
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent as string,
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error("Failed to create order:", orderError);
            return NextResponse.json(
                { error: "Failed to create order" },
                { status: 500 }
            );
        }

        // Create order items
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Failed to create order items:", itemsError);
        }

        // Clear user's cart
        await supabase.from("cart_items").delete().eq("user_id", userId);

        // Update stock
        for (const item of items) {
            await supabase.rpc("decrement_stock" as never, {
                product_id: item.product_id,
                qty: item.quantity,
            } as never);
        }
    }

    return NextResponse.json({ received: true });
}
