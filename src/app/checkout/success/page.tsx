import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
    searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const { session_id } = await searchParams;

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
                Payment Successful!
            </h1>
            <p className="text-muted mt-3 leading-relaxed">
                Thank you for your order. We&apos;ll send you an email confirmation with
                your order details and tracking information.
            </p>

            {session_id && (
                <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-border">
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-muted" />
                        <span className="text-muted">Order reference:</span>
                        <code className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-border">
                            {session_id.slice(0, 20)}...
                        </code>
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/profile">
                    <Button variant="outline" className="gap-2">
                        <Package className="w-4 h-4" />
                        View My Orders
                    </Button>
                </Link>
                <Link href="/products">
                    <Button className="gap-2">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
