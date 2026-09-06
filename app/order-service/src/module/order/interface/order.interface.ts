export interface ICreateOrder {
    user_id: string;
    total_amount: number;
    order_status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface IUpdateOrder {
    total_amount?: number;
    order_status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}