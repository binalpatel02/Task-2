import mongoose, { Schema, Types } from "mongoose";

export interface IOrderItem {
    order_id: Types.ObjectId;   
    product_id: Types.ObjectId; 
    quantity: number;
    unit_price: number;
    subtotal: number;
    created_at?: Date;
    updated_at?: Date;
}

export const orderItemSchema = new Schema<IOrderItem>(
    {
        order_id: {
            type: Schema.Types.ObjectId, 
            required: true,
            index: true
        },

        product_id: {
            type: Schema.Types.ObjectId, 
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
