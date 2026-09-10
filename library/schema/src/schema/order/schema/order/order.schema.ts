import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrder {
    _id: string;
    order_id?: string;
    user_id: string;
    total_amount: number;
    order_status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

const orderSchema = new Schema<IOrder>(
    {
        _id: {
                type: String,
                default: () => uuidv4()
        },

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

export { orderSchema };