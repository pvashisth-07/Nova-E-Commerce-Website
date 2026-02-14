import { createClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/types/order";

export async function getOrders(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(
            "*, order_items(*, products(id, name, images))"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return (data as unknown as OrderWithItems[]) || [];
}

export async function getAllOrders() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select(
            "*, order_items(*, products(id, name, images)), profiles(email, full_name)"
        )
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }

    return data || [];
}
