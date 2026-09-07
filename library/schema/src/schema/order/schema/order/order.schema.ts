import mongoose, { Schema } from "mongoose";

export interface IOrder {
    order_id?: string;
    user_id: string;
    total_amount: number;
    order_status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    created_at?: Date;
    updated_at?: Date;
}

export const orderSchema = new Schema<IOrder>(
    {
        user_id: {
            type: String,
            required: true,
            index: true
        },

        total_amount: {
            type: Number,
            required: true,
            min: 0
        },

        order_status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "CANCELLED",
                "COMPLETED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export const Order = mongoose.model<IOrder>(
    "Order",
    orderSchema
);