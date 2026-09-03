import type { NextFunction, Request, Response } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../service/user.service.js";
import { createUserValidator } from "../validator/user.validator.js";
import { userResponseMapper } from "../mapper/user.mapper.js";

// 1. CREATE USER
export const createUserController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { error } = createUserValidator.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const user = await createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponseMapper(user)
        });
    } catch (error) {
        next(error);
    }
};

// 2. GET ALL USERS
export const getUsersController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const result = await getUsers();

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }

        // Map array contents uniformly
        const formattedUsers = result.map(user => userResponseMapper(user));

        return res.status(200).json({
            success: true,
            data: formattedUsers
        });
    } catch (error) {
        next(error);
    }
};

// 3. GET USER BY ID
export const getUserByIdController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id as string); 

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: userResponseMapper(user)
        });
    } catch (error) {
        next(error);
    }
};

// 4. UPDATE USER
export const updateUserController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { error } = createUserValidator.validate(req.body, { allowUnknown: true });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { id } = req.params;
        const user = await updateUser(id as string, req.body);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: userResponseMapper(user)
        });
    } catch (error) {
        next(error);
    }
};

// 5. DELETE USER
export const deleteUserController = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const statusResult = await deleteUser(id as string);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: statusResult
        });
    } catch (error) {
        next(error);
    }
};
