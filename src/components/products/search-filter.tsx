"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

interface SearchAndFilterProps {
    categories: { id: string; name: string; slug: string }[];
}

export function SearchAndFilter({ categories }: SearchAndFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [showFilters, setShowFilters] = useState(false);

    const currentCategory = searchParams.get("category") || "";
    const currentSort = searchParams.get("sort") || "newest";

    const updateParams = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page"); // Reset to page 1
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateParams("q", search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, updateParams]);

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "price-asc", label: "Price: Low → High" },
        { value: "price-desc", label: "Price: High → Low" },
        { value: "name", label: "Name A-Z" },
    ];

    const hasActiveFilters = currentCategory || currentSort !== "newest" || search;

    const clearFilters = () => {
        setSearch("");
        router.push(pathname);
    };

    return (
        <div className="space-y-4">
            {/* Search + Toggle */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(showFilters && "bg-accent text-white")}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl border border-border p-5 space-y-5 animate-fade-in">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => updateParams("category", "")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                                    !currentCategory
                                        ? "bg-accent text-white"
                                        : "bg-neutral-50 text-muted hover:text-foreground"
                                )}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateParams("category", cat.slug)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                                        currentCategory === cat.slug
                                            ? "bg-accent text-white"
                                            : "bg-neutral-50 text-muted hover:text-foreground"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Sort By</h3>
                        <div className="flex flex-wrap gap-2">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateParams("sort", opt.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                                        currentSort === opt.value
                                            ? "bg-accent text-white"
                                            : "bg-neutral-50 text-muted hover:text-foreground"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-xs text-destructive hover:underline cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
