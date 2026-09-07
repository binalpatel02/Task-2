import mongoose, { Schema } from "mongoose";

export interface IProduct {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export const Product = mongoose.model<IProduct>(
    "Product",
    productSchema
);

export { productSchema };