export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    role: "user" | "admin";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    role?: "user" | "admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    compare_at_price: number | null;
                    category_id: string | null;
                    images: string[];
                    stock: number;
                    is_featured: boolean;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    price: number;
                    compare_at_price?: number | null;
                    category_id?: string | null;
                    images?: string[];
                    stock?: number;
                    is_featured?: boolean;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    price?: number;
                    compare_at_price?: number | null;
                    category_id?: string | null;
                    images?: string[];
                    stock?: number;
                    is_featured?: boolean;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                ];
            };
            cart_items: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    quantity: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    product_id: string;
                    quantity?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    product_id?: string;
                    quantity?: number;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "cart_items_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cart_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
                    total: number;
                    stripe_session_id: string | null;
                    stripe_payment_intent_id: string | null;
                    shipping_address: Json | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
                    total: number;
                    stripe_session_id?: string | null;
                    stripe_payment_intent_id?: string | null;
                    shipping_address?: Json | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
                    total?: number;
                    stripe_session_id?: string | null;
                    stripe_payment_intent_id?: string | null;
                    shipping_address?: Json | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                ];
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string;
                    quantity: number;
                    price: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    product_id: string;
                    quantity: number;
                    price: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string;
                    product_id?: string;
                    quantity?: number;
                    price?: number;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            decrement_stock: {
                Args: {
                    product_id: string;
                    qty: number;
                };
                Returns: undefined;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
