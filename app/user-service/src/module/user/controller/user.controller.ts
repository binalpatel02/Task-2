import type { NextFunction, Request, Response } from "express";
import { createUser } from "../service/user.service.js";
import { createUserValidator } from "../validator/user.validator.js";
import { userResponseMapper } from "../mapper/user.mapper.js";

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