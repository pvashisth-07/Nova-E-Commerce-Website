import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Shop: [
            { href: "/products", label: "All Products" },
            { href: "/categories/electronics", label: "Electronics" },
            { href: "/categories/audio", label: "Audio" },
            { href: "/categories/wearables", label: "Wearables" },
            { href: "/categories/accessories", label: "Accessories" },
        ],
        Company: [
            { href: "#", label: "About" },
            { href: "#", label: "Careers" },
            { href: "#", label: "Press" },
        ],
        Support: [
            { href: "#", label: "Help Center" },
            { href: "#", label: "Shipping" },
            { href: "#", label: "Returns" },
            { href: "#", label: "Contact" },
        ],
    };

    return (
        <footer className="border-t border-border bg-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">N</span>
                            </div>
                            <span className="text-lg font-semibold tracking-tight">NOVA</span>
                        </Link>
                        <p className="text-sm text-muted max-w-xs leading-relaxed">
                            Premium tech products designed for the modern lifestyle. Quality you can feel.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} NOVA. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
