import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map(
                (item: {
                    name: string;
                    price: number;
                    quantity: number;
                    image: string;
                }) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            images: item.image ? [item.image] : [],
                        },
                        unit_amount: Math.round(item.price * 100), // Convert to cents
                    },
                    quantity: item.quantity,
                })
            ),
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
            customer_email: user.email,
            metadata: {
                user_id: user.id,
                items: JSON.stringify(
                    items.map(
                        (item: { product_id: string; price: number; quantity: number }) => ({
                            product_id: item.product_id,
                            price: item.price,
                            quantity: item.quantity,
                        })
                    )
                ),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
