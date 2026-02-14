import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Sparkles, Truck, Shield, Headphones } from "lucide-react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium text-muted mb-6 border border-border">
              <Sparkles className="w-3.5 h-3.5" />
              New arrivals are here
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Technology that
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900">
                feels premium.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              Curated collection of premium tech products designed for the modern
              lifestyle. Quality you can feel, innovation you can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-neutral-200/40 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-neutral-200/30 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Bar */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, label: "Secure Payment", desc: "256-bit encryption" },
              { icon: Headphones, label: "24/7 Support", desc: "Always here to help" },
              { icon: Sparkles, label: "Premium Quality", desc: "Curated products" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-50">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Featured Products
            </h2>
            <p className="text-muted mt-2">Hand-picked for you</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="bg-neutral-50/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Shop by Category
            </h2>
            <p className="text-muted mt-2">Find exactly what you need</p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-2xl animate-shimmer"
                  />
                ))}
              </div>
            }
          >
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-accent text-white p-10 sm:p-16">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Join the NOVA community
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Get early access to new products, exclusive deals, and tech
              insights delivered to your inbox.
            </p>
            <div className="mt-8 flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="h-12 px-6 bg-white text-accent font-medium rounded-xl hover:bg-white/90 transition-colors text-sm cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}

async function FeaturedProducts() {
  const { products } = await getProducts({ featured: true, limit: 8 });
  return <ProductGrid products={products} />;
}

async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative flex flex-col items-center justify-center h-32 rounded-2xl bg-white border border-border hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <h3 className="font-medium text-sm group-hover:text-accent transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-muted mt-1">{category.description}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
