"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { ProductWithCategory } from "@/types/product";

interface ProductCardProps {
    product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const hasDiscount =
        product.compare_at_price && product.compare_at_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(
            ((product.compare_at_price! - product.price) /
                product.compare_at_price!) *
            100
        )
        : 0;

    return (
        <div className="group relative bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
            {/* Image */}
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No Image
                        </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            -{discountPercent}%
                        </span>
                    )}

                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <span className="text-sm font-medium text-muted">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-4">
                {product.categories && (
                    <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                        {product.categories.name}
                    </p>
                )}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.compare_at_price!)}
                            </span>
                        )}
                    </div>

                    {product.stock > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addItem(product);
                            }}
                            className="p-2 rounded-lg bg-accent/5 hover:bg-accent hover:text-white text-accent transition-all duration-200 cursor-pointer"
                            aria-label={`Add ${product.name} to cart`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
