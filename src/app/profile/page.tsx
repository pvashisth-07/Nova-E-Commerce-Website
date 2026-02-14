import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrders } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, User, Mail, Calendar } from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const orders = await getOrders(user.id);

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">
                            {profile?.full_name || "User"}
                        </h1>
                        <div className="flex items-center gap-1.5 text-sm text-muted mt-1">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            Member since{" "}
                            {new Date(user.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders */}
            <div id="orders">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-border">
                        <Package className="w-10 h-10 text-muted mx-auto mb-3" />
                        <p className="text-muted">No orders yet</p>
                        <a
                            href="/products"
                            className="text-sm text-accent hover:underline mt-2 inline-block"
                        >
                            Start shopping →
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl border border-border p-5"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-muted font-mono">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-muted mt-0.5">
                                            {new Date(order.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={statusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                        <p className="text-sm font-semibold mt-1">
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2">
                                    {order.order_items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 py-2 border-t border-border first:border-0"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-50 shrink-0">
                                                {item.products?.images?.[0] ? (
                                                    <Image
                                                        src={item.products.images[0]}
                                                        alt={item.products.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-[10px] text-muted">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {item.products?.name || "Product"}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
