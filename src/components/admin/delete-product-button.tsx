"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export function DeleteProductButton({
    productId,
    productName,
}: DeleteProductButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const supabase = createClient();

    const handleDelete = async () => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;

        setIsDeleting(true);

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", productId);

        if (error) {
            toast.error("Failed to delete product");
            setIsDeleting(false);
            return;
        }

        toast.success("Product deleted");
        router.refresh();
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted hover:text-destructive disabled:opacity-50 cursor-pointer"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
