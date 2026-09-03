import mongoose from "mongoose";

export const connectDatabase = async ( mongoURI: string ): Promise<void> => {
    try {
        await mongoose.connect(mongoURI);

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);

        throw error;
    }
};