import mongoose, { model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
    user_id: string;
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
    password_hash: string;
    created_at?: Date;
    updated_at?: Date;
}

export const userSchema: Schema<IUser, Model<IUser>> = new mongoose.Schema<IUser, Model<IUser>>(
    {
        user_id: {
            type: String,
            default: () => uuidv4(), 
            unique: true,
            index: true
        },

        first_name: {
            type: String,
            required: true,
            trim: true
        },

        last_name: {
            type: String,
            required: true,
            trim: true
        },

        mobile_number: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },

        password_hash: {
            type: String,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export const User: Model<IUser> = model<IUser>("User", userSchema);
