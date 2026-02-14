import type { Database } from "./database";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type OrderWithItems = Order & {
    order_items: (OrderItem & {
        products: {
            id: string;
            name: string;
            images: string[];
        };
    })[];
};
