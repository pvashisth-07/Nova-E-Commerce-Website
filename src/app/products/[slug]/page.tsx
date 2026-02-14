import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductGrid } from "@/components/products/product-grid";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    return (
        <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductContent slug={slug} />
        </Suspense>
    );
}

async function ProductContent({ slug }: { slug: string }) {
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(
        product.category_id,
        product.id
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                <a href="/" className="hover:text-foreground transition-colors">
                    Home
                </a>
                <span>/</span>
                <a href="/products" className="hover:text-foreground transition-colors">
                    Products
                </a>
                {product.categories && (
                    <>
                        <span>/</span>
                        <a
                            href={`/categories/${product.categories.slug}`}
                            className="hover:text-foreground transition-colors"
                        >
                            {product.categories.name}
                        </a>
                    </>
                )}
                <span>/</span>
                <span className="text-foreground">{product.name}</span>
            </nav>

            {/* Product Detail */}
            <ProductDetail product={product} />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-xl font-semibold tracking-tight mb-8">
                        You might also like
                    </h2>
                    <ProductGrid products={relatedProducts} />
                </section>
            )}
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-48" />
                </div>
            </div>
        </div>
    );
}
