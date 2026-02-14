import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/product";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const [{ data: product }, { data: categories }] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("categories").select("id, name").order("name"),
    ]);

    if (!product) notFound();

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">
                Edit Product
            </h1>
            <div className="bg-white rounded-xl border border-border p-6">
                <ProductForm
                    product={product as unknown as Product}
                    categories={categories || []}
                />
            </div>
        </div>
    );
}
