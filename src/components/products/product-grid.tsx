"use client";

import { ProductCard } from "@/components/products/product-card";
import type { ProductWithCategory } from "@/types/product";

interface ProductGridProps {
    products: ProductWithCategory[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted text-lg">No products found</p>
                <p className="text-muted-foreground text-sm mt-2">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
