import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
    password_hash: string;
    created_at?: Date;
    updated_at?: Date;
}

const userSchema = new Schema<IUser>(
    {
        _id: {
                type: String,
                default: () => uuidv4()
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

export const User = mongoose.model<IUser>(
    "User",
    userSchema
);

export { userSchema };