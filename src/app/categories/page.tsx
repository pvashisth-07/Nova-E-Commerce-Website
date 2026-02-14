import Link from "next/link";
import { getCategories } from "@/services/categories";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    Categories
                </h1>
                <p className="text-muted mt-1">Browse products by category</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group relative flex flex-col justify-end h-48 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 border border-border p-6 hover:shadow-large hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neutral-200/50 to-transparent rounded-full blur-2xl" />
                        <h2 className="text-xl font-semibold group-hover:text-accent transition-colors relative z-10">
                            {category.name}
                        </h2>
                        {category.description && (
                            <p className="text-sm text-muted mt-1 relative z-10">
                                {category.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
