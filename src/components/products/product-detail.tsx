"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Check, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { ProductWithCategory } from "@/types/product";

interface ProductDetailProps {
    product: ProductWithCategory;
}

export function ProductDetail({ product }: ProductDetailProps) {
    const { addItem } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const hasDiscount =
        product.compare_at_price && product.compare_at_price > product.price;
    const savings = hasDiscount
        ? product.compare_at_price! - product.price
        : 0;
    const inStock = product.stock > 0;

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addItem(product, quantity);
        setIsAdding(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-fade-in">
            {/* Image Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-border">
                    {product.images?.[selectedImage] ? (
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted">
                            No Image
                        </div>
                    )}
                    {hasDiscount && (
                        <Badge className="absolute top-4 left-4 bg-accent text-white border-0">
                            Save {formatPrice(savings)}
                        </Badge>
                    )}
                </div>

                {/* Thumbnail Row */}
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-3">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index
                                        ? "border-accent"
                                        : "border-transparent hover:border-border"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                {/* Category */}
                {product.categories && (
                    <p className="text-xs text-muted uppercase tracking-widest mb-2">
                        {product.categories.name}
                    </p>
                )}

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl font-bold">
                        {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(product.compare_at_price!)}
                        </span>
                    )}
                </div>

                {/* Description */}
                {product.description && (
                    <p className="text-muted leading-relaxed mt-6">
                        {product.description}
                    </p>
                )}

                {/* Stock Status */}
                <div className="mt-6">
                    {inStock ? (
                        <div className="flex items-center gap-2 text-sm text-success">
                            <Check className="w-4 h-4" />
                            In Stock ({product.stock} available)
                        </div>
                    ) : (
                        <div className="text-sm text-destructive">Out of Stock</div>
                    )}
                </div>

                {/* Quantity & Add to Cart */}
                {inStock && (
                    <div className="flex items-center gap-4 mt-8">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-card-hover transition-colors cursor-pointer"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity(Math.min(product.stock, quantity + 1))
                                }
                                className="p-3 hover:bg-card-hover transition-colors cursor-pointer"
                                disabled={quantity >= product.stock}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <Button
                            size="lg"
                            className="flex-1 gap-2"
                            onClick={handleAddToCart}
                            isLoading={isAdding}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </Button>
                    </div>
                )}

                {/* Shipping Info */}
                <div className="mt-8 p-4 rounded-xl bg-neutral-50 border border-border">
                    <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted" />
                        <div>
                            <p className="text-sm font-medium">Free shipping on orders over $50</p>
                            <p className="text-xs text-muted mt-0.5">
                                Estimated delivery: 3-5 business days
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
