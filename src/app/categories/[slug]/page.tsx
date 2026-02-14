import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/services/products";
import { getCategories, getCategoryBySlug } from "@/services/categories";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { slug } = await params;
    const { page: pageStr } = await searchParams;
    const page = Number(pageStr) || 1;

    const category = await getCategoryBySlug(slug);
    if (!category) notFound();

    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {category.name}
                </h1>
                {category.description && (
                    <p className="text-muted mt-1">{category.description}</p>
                )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                <Link
                    href="/products"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-50 text-muted hover:text-foreground transition-colors"
                >
                    All
                </Link>
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cat.slug === slug
                                ? "bg-accent text-white"
                                : "bg-neutral-50 text-muted hover:text-foreground"
                            }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            {/* Products */}
            <Suspense key={`${slug}-${page}`} fallback={<ProductGridSkeleton />}>
                <CategoryProducts slug={slug} page={page} />
            </Suspense>
        </div>
    );
}

async function CategoryProducts({ slug, page }: { slug: string; page: number }) {
    const limit = 12;
    const { products, total } = await getProducts({ page, limit, category: slug });
    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <p className="text-sm text-muted mb-6">
                {total} product{total !== 1 ? "s" : ""}
            </p>
            <ProductGrid products={products} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/categories/${slug}`}
            />
        </>
    );
}
