import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrderItem {
    _id: string;
    order_id: string;   
    product_id: string; 
    quantity: number;
    unit_price: number;
    subtotal: number;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        _id: {
                type: String,
                default: () => uuidv4()
        },

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
            min: [1, "Quantity cannot be less than 1"]
        },

        unit_price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },

        subtotal: {
            type: Number,
            required: true,
            min: [0, "Subtotal cannot be negative"]
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

orderItemSchema.index({ order_id: 1, product_id: 1 }, { unique: true });

export const OrderItem = mongoose.model<IOrderItem>("OrderItem", orderItemSchema);

export { orderItemSchema };