export interface IProduct {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    created_at?: Date;
    updated_at?: Date;
}