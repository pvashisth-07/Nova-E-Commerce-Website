import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from("orders")
        .select(
            "*, order_items(quantity), profiles(email, full_name)"
        )
        .order("created_at", { ascending: false });

    const statusVariant = (status: string) => {
        switch (status) {
            case "processing":
                return "warning" as const;
            case "shipped":
                return "default" as const;
            case "delivered":
                return "success" as const;
            case "cancelled":
                return "destructive" as const;
            default:
                return "outline" as const;
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">Orders</h1>

            <div className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50 border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
                    <div className="col-span-2">Order</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Items</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-2">Status</div>
                </div>

                {/* Table Body */}
                {orders && orders.length > 0 ? (
                    <div className="divide-y divide-border">
                        {orders.map((order) => {
                            const profile = order.profiles as unknown as {
                                email: string;
                                full_name: string | null;
                            };
                            const itemCount = (
                                order.order_items as unknown as { quantity: number }[]
                            ).reduce(
                                (sum: number, item: { quantity: number }) =>
                                    sum + item.quantity,
                                0
                            );

                            return (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-card-hover transition-colors"
                                >
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium font-mono">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="col-span-3 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {profile?.full_name || "—"}
                                        </p>
                                        <p className="text-xs text-muted truncate">
                                            {profile?.email || "N/A"}
                                        </p>
                                    </div>
                                    <div className="col-span-2 text-sm text-muted">
                                        {new Date(order.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div className="col-span-1 text-sm">{itemCount}</div>
                                    <div className="col-span-2 text-sm font-semibold">
                                        {formatPrice(order.total)}
                                    </div>
                                    <div className="col-span-2">
                                        <Badge variant={statusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-10 text-center text-muted text-sm">
                        No orders yet
                    </div>
                )}
            </div>
        </div>
    );
}
