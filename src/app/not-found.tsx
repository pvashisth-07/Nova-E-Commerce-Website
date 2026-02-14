import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-7xl font-bold text-neutral-200 mb-4">404</h1>
            <h2 className="text-xl font-semibold mb-2">Page not found</h2>
            <p className="text-muted text-sm mb-8 max-w-sm">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/">
                <Button>Go Home</Button>
            </Link>
        </div>
    );
}
