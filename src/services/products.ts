import { createClient } from "@/lib/supabase/server";
import type { ProductWithCategory } from "@/types/product";

interface GetProductsOptions {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: "newest" | "price-asc" | "price-desc" | "name";
    featured?: boolean;
}

export async function getProducts(options: GetProductsOptions = {}) {
    const {
        page = 1,
        limit = 12,
        category,
        search,
        sort = "newest",
        featured,
    } = options;

    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("products")
        .select("*, categories(id, name, slug)", { count: "exact" })
        .eq("is_active", true);

    if (category) {
        const { data: cat } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", category)
            .single();

        if (cat) {
            query = query.eq("category_id", cat.id);
        }
    }

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    if (featured) {
        query = query.eq("is_featured", true);
    }

    // Sort
    switch (sort) {
        case "price-asc":
            query = query.order("price", { ascending: true });
            break;
        case "price-desc":
            query = query.order("price", { ascending: false });
            break;
        case "name":
            query = query.order("name", { ascending: true });
            break;
        default:
            query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0 };
    }

    return {
        products: (data as unknown as ProductWithCategory[]) || [],
        total: count || 0,
    };
}

export async function getProductBySlug(slug: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }

    return data as unknown as ProductWithCategory;
}

export async function getRelatedProducts(
    categoryId: string | null,
    excludeId: string,
    limit = 4
) {
    const supabase = await createClient();

    let query = supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .eq("is_active", true)
        .neq("id", excludeId)
        .limit(limit);

    if (categoryId) {
        query = query.eq("category_id", categoryId);
    }

    const { data } = await query;

    return (data as unknown as ProductWithCategory[]) || [];
}
