"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { toast } from "sonner";

interface CartContextType {
    items: CartItem[];
    isLoading: boolean;
    itemCount: number;
    subtotal: number;
    addItem: (product: Product, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    items: [],
    isLoading: true,
    itemCount: 0,
    subtotal: 0,
    addItem: async () => { },
    removeItem: async () => { },
    updateQuantity: async () => { },
    clearCart: async () => { },
});

const CART_STORAGE_KEY = "ecommerce_cart";

function getLocalCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function setLocalCart(items: CartItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const supabase = createClient();

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Fetch cart items
    const fetchCart = useCallback(async () => {
        setIsLoading(true);

        if (user) {
            // Fetch from Supabase for logged-in users
            const { data } = await supabase
                .from("cart_items")
                .select("id, product_id, quantity, products(*)")
                .eq("user_id", user.id);

            if (data) {
                const cartItems: CartItem[] = data.map((item) => ({
                    id: item.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    product: item.products as unknown as Product,
                }));
                setItems(cartItems);
            }
        } else {
            // Use localStorage for guests
            setItems(getLocalCart());
        }

        setIsLoading(false);
    }, [user, supabase]);

    // Sync local cart to Supabase on login
    useEffect(() => {
        const syncLocalToDb = async () => {
            if (!user) return;

            const localItems = getLocalCart();
            if (localItems.length === 0) return;

            for (const item of localItems) {
                await supabase.from("cart_items").upsert(
                    {
                        user_id: user.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                    },
                    { onConflict: "user_id,product_id" }
                );
            }

            localStorage.removeItem(CART_STORAGE_KEY);
        };

        syncLocalToDb().then(fetchCart);
    }, [user, supabase, fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (product: Product, quantity = 1) => {
        const existing = items.find((item) => item.product_id === product.id);

        if (user) {
            if (existing) {
                await supabase
                    .from("cart_items")
                    .update({ quantity: existing.quantity + quantity })
                    .eq("id", existing.id);
            } else {
                await supabase.from("cart_items").insert({
                    user_id: user.id,
                    product_id: product.id,
                    quantity,
                });
            }
            await fetchCart();
        } else {
            let newItems: CartItem[];
            if (existing) {
                newItems = items.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [
                    ...items,
                    {
                        id: crypto.randomUUID(),
                        product_id: product.id,
                        quantity,
                        product,
                    },
                ];
            }
            setItems(newItems);
            setLocalCart(newItems);
        }

        toast.success("Added to cart");
    };

    const removeItem = async (productId: string) => {
        if (user) {
            await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", productId);
            await fetchCart();
        } else {
            const newItems = items.filter((item) => item.product_id !== productId);
            setItems(newItems);
            setLocalCart(newItems);
        }

        toast.success("Removed from cart");
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            await removeItem(productId);
            return;
        }

        if (user) {
            await supabase
                .from("cart_items")
                .update({ quantity })
                .eq("user_id", user.id)
                .eq("product_id", productId);
            await fetchCart();
        } else {
            const newItems = items.map((item) =>
                item.product_id === productId ? { ...item, quantity } : item
            );
            setItems(newItems);
            setLocalCart(newItems);
        }
    };

    const clearCart = async () => {
        if (user) {
            await supabase.from("cart_items").delete().eq("user_id", user.id);
            await fetchCart();
        } else {
            setItems([]);
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                isLoading,
                itemCount,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
