import { Suspense } from "react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { ProductGrid } from "@/components/products/product-grid";
import { SearchAndFilter } from "@/components/products/search-filter";
import { Pagination } from "@/components/products/pagination";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
        category?: string;
        sort?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.q || "";
    const category = params.category || "";
    const sort = (params.sort as "newest" | "price-asc" | "price-desc" | "name") || "newest";

    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {category
                        ? categories.find((c) => c.slug === category)?.name || "Products"
                        : search
                            ? `Results for "${search}"`
                            : "All Products"}
                </h1>
                <p className="text-muted mt-1">
                    Discover our curated collection of premium tech
                </p>
            </div>

            {/* Search & Filter */}
            <div className="mb-8">
                <SearchAndFilter categories={categories} />
            </div>

            {/* Products */}
            <Suspense key={`${page}-${search}-${category}-${sort}`} fallback={<ProductGridSkeleton />}>
                <ProductsList
                    page={page}
                    search={search}
                    category={category}
                    sort={sort}
                />
            </Suspense>
        </div>
    );
}

async function ProductsList({
    page,
    search,
    category,
    sort,
}: {
    page: number;
    search: string;
    category: string;
    sort: "newest" | "price-asc" | "price-desc" | "name";
}) {
    const limit = 12;
    const { products, total } = await getProducts({
        page,
        limit,
        search,
        category,
        sort,
    });

    const totalPages = Math.ceil(total / limit);

    const searchParamsObj: Record<string, string> = {};
    if (search) searchParamsObj.q = search;
    if (category) searchParamsObj.category = category;
    if (sort !== "newest") searchParamsObj.sort = sort;

    return (
        <>
            <p className="text-sm text-muted mb-6">
                Showing {products.length} of {total} products
            </p>
            <ProductGrid products={products} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/products"
                searchParams={searchParamsObj}
            />
        </>
    );
}
