import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IError {
    _id: string;
     method: string;
    url: string;
    header?: Record<string, unknown>;
    extra?: Record<string, unknown>;
    data?: Record<string, unknown>;
    created_at?: Date;
}

const errorSchema = new Schema<IError>(
    {
        _id: {
                type: String,
                default: () => uuidv4()
        },

         method: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        header: {
            type: Schema.Types.Mixed,
            default: {}
        },

        extra: {
            type: Schema.Types.Mixed,
            default: {}
        },

        data: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        collection: "errors",

        timestamps: {
            createdAt: "created_at",
            updatedAt: false
        }
    }
); 

export const ErrorModel = mongoose.model<IError>(
    "Error",
    errorSchema
);

export { errorSchema };