"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { formatPrice } from "@/lib/utils";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const shipping = subtotal >= 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!user) {
            router.push("/login?redirect=/checkout");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        product_id: item.product_id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: item.product.images?.[0] || "",
                    })),
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to create checkout session");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">Checkout</h1>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm py-2 border-b border-border last:border-0"
                        >
                            <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-muted text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                                {formatPrice(item.product.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Shipping</span>
                        <span className={shipping === 0 ? "text-success" : ""}>
                            {shipping === 0 ? "Free" : formatPrice(shipping)}
                        </span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            {/* Security Info */}
            <div className="bg-neutral-50 rounded-xl border border-border p-4 mb-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <div>
                        <p className="text-sm font-medium">Secure checkout powered by Stripe</p>
                        <p className="text-xs text-muted">
                            Your payment information is encrypted and secure
                        </p>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleCheckout}
                isLoading={isProcessing}
            >
                <Lock className="w-4 h-4" />
                Pay {formatPrice(total)}
            </Button>

            <div className="flex items-center justify-center gap-4 mt-4">
                <CreditCard className="w-6 h-4 text-muted" />
                <span className="text-xs text-muted">
                    Visa, Mastercard, Amex accepted
                </span>
            </div>
        </div>
    );
}
