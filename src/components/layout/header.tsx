"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, User, Search, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();
    const { itemCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="text-white text-sm font-bold">N</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight">NOVA</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-accent/5 text-accent"
                                        : "text-muted hover:text-foreground hover:bg-card-hover"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <Link
                            href="/products?search=true"
                            className="p-2.5 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                        >
                            <Search className="w-[18px] h-[18px]" />
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2.5 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                        >
                            <ShoppingBag className="w-[18px] h-[18px]" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2.5 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground cursor-pointer"
                                >
                                    <User className="w-[18px] h-[18px]" />
                                </button>
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-large border border-border py-2 z-20 animate-scale-in">
                                            <div className="px-4 py-2 border-b border-border">
                                                <p className="text-sm font-medium truncate">
                                                    {profile?.full_name || user.email}
                                                </p>
                                                <p className="text-xs text-muted truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-card-hover transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <Link
                                                href="/profile#orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-card-hover transition-colors"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                My Orders
                                            </Link>
                                            {profile?.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-card-hover transition-colors text-accent font-medium"
                                                >
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <div className="border-t border-border mt-1 pt-1">
                                                <button
                                                    onClick={() => {
                                                        signOut();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 w-full transition-colors cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-[18px] h-[18px]" />
                            ) : (
                                <Menu className="w-[18px] h-[18px]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 animate-fade-in">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        pathname === link.href
                                            ? "bg-accent/5 text-accent"
                                            : "text-muted hover:text-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="mt-2 mx-4 text-center py-2.5 bg-accent text-white text-sm font-medium rounded-lg"
                                >
                                    Sign In
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
