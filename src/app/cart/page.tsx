"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
    const { items, isLoading, subtotal, updateQuantity, removeItem } = useCart();

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-semibold tracking-tight mb-8">
                    Shopping Cart
                </h1>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-50 mb-6">
                    <ShoppingBag className="w-8 h-8 text-muted" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Your cart is empty
                </h1>
                <p className="text-muted mt-2 mb-8">
                    Discover our collection and find something you love.
                </p>
                <Link href="/products">
                    <Button size="lg" className="gap-2">
                        Browse Products
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">
                Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-white rounded-xl border border-border animate-fade-in"
                        >
                            {/* Image */}
                            <Link
                                href={`/products/${item.product.slug}`}
                                className="relative w-24 h-24 rounded-lg overflow-hidden bg-neutral-50 shrink-0"
                            >
                                {item.product.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-muted">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="font-medium text-sm hover:text-accent transition-colors line-clamp-1"
                                >
                                    {item.product.name}
                                </Link>
                                <p className="text-sm font-semibold mt-1">
                                    {formatPrice(item.product.price)}
                                </p>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product_id, item.quantity - 1)
                                            }
                                            className="p-1.5 hover:bg-card-hover transition-colors cursor-pointer"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product_id, item.quantity + 1)
                                            }
                                            className="p-1.5 hover:bg-card-hover transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        className="p-1.5 text-muted hover:text-destructive transition-colors cursor-pointer"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Line Total */}
                            <div className="text-right">
                                <p className="text-sm font-semibold">
                                    {formatPrice(item.product.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
                        <h2 className="font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Shipping</span>
                                <span className="text-success">
                                    {subtotal >= 50 ? "Free" : formatPrice(9.99)}
                                </span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>
                                    {formatPrice(subtotal + (subtotal >= 50 ? 0 : 9.99))}
                                </span>
                            </div>
                        </div>

                        <Link href="/checkout" className="block mt-6">
                            <Button className="w-full gap-2" size="lg">
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        <Link
                            href="/products"
                            className="block text-center text-sm text-muted hover:text-foreground mt-4 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
