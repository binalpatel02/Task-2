import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@library/schema/user";
import { publishKafkaMessage } from "@library/third-party/kafka";
import { USER_TOPICS } from "../../../library/kafka/topic.js";

interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = async ({ email, password }: ILoginRequest) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash as unknown as string
    );

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        {
            user_id: user._id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        access_token: token,
        token_type: "Bearer",
        expires_in: "1d",
        user: {
            user_id: user._id,
            email: user.email
        }
    };
};

export const createUser = async (data: any) => {
    const existingUser = await User.findOne({
        email: data.email
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(
        data.password,
        10
    );

    const user = await User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number,
        password_hash: passwordHash
    });

    // Publish Kafka event
    await publishKafkaMessage(
        USER_TOPICS.CREATED,
        {
            user_id: user._id.toString(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile_number: user.mobile_number
        },
         user._id.toString()
    );

    return user;
};

export const getUsers = async () => {
    const users = await User.find().select("-password_hash");
    return users;
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id).select("-password_hash");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

export const updateUser = async (id: string, data: any) => {
    // Check duplicate email
    if (data.email) {
     const emailTaken = await User.findOne({ email: data.email, _id: { $ne: id } });
        if (emailTaken) {
            throw new Error("Email is already in use by another account");
        }
    }

    const updateData = { ...data };
    if (data.password) {
        updateData.password_hash = await bcrypt.hash(data.password, 10);
        delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
            runValidators: true
        }).select("-password_hash");

    if (!updatedUser) {
        throw new Error("User not found to update");
    }

    // Publish Kafka event
    await publishKafkaMessage(
        USER_TOPICS.UPDATED,
        {
            user_id: updatedUser._id.toString(),
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            mobile_number: updatedUser.mobile_number
        },
        id 
    );

    return updatedUser;
};

export const deleteUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found to delete");
    }

    await User.findByIdAndDelete(id);

    // Publish Kafka event
    await publishKafkaMessage(
        USER_TOPICS.DELETED,
        {
            user_id: user._id.toString(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile_number: user.mobile_number
        },
        id 
    );

    return {
        id: user._id,
        message: "User deleted from database successfully"
    };
};
