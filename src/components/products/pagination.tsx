import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    searchParams?: Record<string, string>;
}

export function Pagination({
    currentPage,
    totalPages,
    basePath,
    searchParams = {},
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const createUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        return `${basePath}?${params.toString()}`;
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-12">
            {/* Prev */}
            {currentPage > 1 ? (
                <Link
                    href={createUrl(currentPage - 1)}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 text-muted-foreground/40">
                    <ChevronLeft className="w-4 h-4" />
                </span>
            )}

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
                page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 text-muted-foreground text-sm">
                        ...
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={createUrl(page)}
                        className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                            currentPage === page
                                ? "bg-accent text-white"
                                : "hover:bg-card-hover text-muted"
                        )}
                    >
                        {page}
                    </Link>
                )
            )}

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    href={createUrl(currentPage + 1)}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 text-muted-foreground/40">
                    <ChevronRight className="w-4 h-4" />
                </span>
            )}
        </nav>
    );
}
