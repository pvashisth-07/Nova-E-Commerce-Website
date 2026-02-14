import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50 border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Body */}
                {products && products.length > 0 ? (
                    <div className="divide-y divide-border">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-card-hover transition-colors"
                            >
                                {/* Product */}
                                <div className="col-span-5 flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-50 shrink-0">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[8px] text-muted">
                                                N/A
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-muted truncate">
                                            {(product.categories as unknown as { name: string })?.name || "Uncategorized"}
                                        </p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-2 text-sm font-medium">
                                    {formatPrice(product.price)}
                                </div>

                                {/* Stock */}
                                <div className="col-span-1 text-sm">{product.stock}</div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <Badge
                                        variant={product.is_active ? "success" : "destructive"}
                                    >
                                        {product.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <DeleteProductButton
                                        productId={product.id}
                                        productName={product.name}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-muted text-sm">
                        No products yet. Add your first product!
                    </div>
                )}
            </div>
        </div>
    );
}
