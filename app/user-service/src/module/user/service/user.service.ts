import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

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

    const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number,
        password_hash: passwordHash
    };

    const user = await User.create(userData);

    return user;
};