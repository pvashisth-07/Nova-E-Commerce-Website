import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [
        { count: productCount },
        { count: orderCount },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
            .from("orders")
            .select("id, total, status, created_at, profiles(email)")
            .order("created_at", { ascending: false })
            .limit(5),
    ]);

    const totalRevenue =
        recentOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    const stats = [
        {
            label: "Total Products",
            value: productCount || 0,
            icon: ShoppingBag,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Orders",
            value: orderCount || 0,
            icon: Package,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Recent Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Active",
            value: "Online",
            icon: Users,
            color: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-border p-5"
                    >
                        <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-border">
                <div className="p-5 border-b border-border">
                    <h2 className="font-semibold">Recent Orders</h2>
                </div>
                {recentOrders && recentOrders.length > 0 ? (
                    <div className="divide-y divide-border">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between px-5 py-4"
                            >
                                <div>
                                    <p className="text-sm font-medium font-mono">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted mt-0.5">
                                        {(order.profiles as unknown as { email: string })?.email || "N/A"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">
                                        ${(order.total || 0).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted capitalize">{order.status}</p>
                                </div>
                            </div>
                        ))}
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
