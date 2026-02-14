import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold tracking-tight mb-8">
                Add New Product
            </h1>
            <div className="bg-white rounded-xl border border-border p-6">
                <ProductForm categories={categories || []} />
            </div>
        </div>
    );
}
