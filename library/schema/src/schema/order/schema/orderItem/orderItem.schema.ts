import mongoose, { Schema } from "mongoose";

export interface IOrderItem {
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at?: Date;
    updated_at?: Date;
}

export const orderItemSchema = new Schema<IOrderItem>(
    {
        order_id: {
            type: String,
            required: true,
            index: true
        },

        product_id: {
            type: String,
            required: true,
            index: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unit_price: {
            type: Number,
            required: true,
            min: 0
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        collection: "order_item",

        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export const OrderItem = mongoose.model<IOrderItem>(
    "OrderItem",
    orderItemSchema
);