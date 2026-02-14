"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import type { Product } from "@/types/product";
import Image from "next/image";

interface ProductFormProps {
    product?: Product;
    categories: { id: string; name: string }[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const isEditing = !!product;

    const [name, setName] = useState(product?.name || "");
    const [slug, setSlug] = useState(product?.slug || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price?.toString() || "");
    const [compareAtPrice, setCompareAtPrice] = useState(
        product?.compare_at_price?.toString() || ""
    );
    const [categoryId, setCategoryId] = useState(product?.category_id || "");
    const [stock, setStock] = useState(product?.stock?.toString() || "0");
    const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
    const [isActive, setIsActive] = useState(product?.is_active ?? true);
    const [images, setImages] = useState<string[]>(product?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleNameChange = (value: string) => {
        setName(value);
        if (!isEditing) {
            setSlug(slugify(value));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setIsUploading(true);

        for (const file of Array.from(files)) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, file);

            if (uploadError) {
                toast.error(`Failed to upload ${file.name}`);
                continue;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("product-images").getPublicUrl(fileName);

            setImages((prev) => [...prev, publicUrl]);
        }

        setIsUploading(false);
        toast.success("Images uploaded");
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productData = {
            name,
            slug,
            description: description || null,
            price: parseFloat(price),
            compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
            category_id: categoryId || null,
            stock: parseInt(stock),
            is_featured: isFeatured,
            is_active: isActive,
            images,
        };

        if (isEditing) {
            const { error } = await supabase
                .from("products")
                .update(productData)
                .eq("id", product.id);

            if (error) {
                toast.error("Failed to update product");
                setIsSubmitting(false);
                return;
            }

            toast.success("Product updated");
        } else {
            const { error } = await supabase.from("products").insert(productData);

            if (error) {
                toast.error("Failed to create product");
                setIsSubmitting(false);
                return;
            }

            toast.success("Product created");
        }

        router.push("/admin/products");
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Input
                        label="Product Name"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                        placeholder="e.g. Wireless Headphones"
                    />

                    <Input
                        label="Slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        placeholder="wireless-headphones"
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                            placeholder="Product description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder="29.99"
                        />
                        <Input
                            label="Compare at Price ($)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={compareAtPrice}
                            onChange={(e) => setCompareAtPrice(e.target.value)}
                            placeholder="39.99"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                            >
                                <option value="">Uncategorized</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="rounded border-border"
                            />
                            Featured
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="rounded border-border"
                            />
                            Active
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium">Product Images</label>

                    {/* Upload Area */}
                    <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-border bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-muted mb-2" />
                        <p className="text-sm text-muted">Click to upload images</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, WebP up to 5MB
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>

                    {isUploading && (
                        <p className="text-sm text-muted animate-pulse-soft">
                            Uploading...
                        </p>
                    )}

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((url, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                >
                                    <Image
                                        src={url}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="120px"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {images.length === 0 && !isUploading && (
                        <div className="flex items-center gap-2 text-sm text-muted p-4 bg-neutral-50 rounded-lg">
                            <ImageIcon className="w-4 h-4" />
                            No images added yet
                        </div>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button type="submit" isLoading={isSubmitting}>
                    {isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/admin/products")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
