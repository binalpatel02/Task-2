export interface ICreateOrderItem {
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price?: number;
    subtotal?: number;
}

export interface IUpdateOrderItem {
    quantity?: number;
    unit_price?: number;
}