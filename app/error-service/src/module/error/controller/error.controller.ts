import type { Request, Response, NextFunction } from "express";

import { createError, getErrors, getErrorById, updateErrorById, deleteErrorById } from "../service/error.service.js" 

import { createErrorValidator } from "../validator/error.validator.js";


export const createErrorController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { error } = createErrorValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await createError(req.body);

        return res.status(201).json({
            success: true,
            message: "Error stored successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


export const getErrorsController = async ( _req: Request, res: Response, next: NextFunction ) => {

    try {

        const errors = await getErrors();

        return res.status(200).json({
            success: true,
            data: errors
        });

    } catch (error) {
        next(error);
    }
};


export const getErrorByIdController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const error = await getErrorById(req.params.error_id as string );

        return res.status(200).json({
            success: true,
            data: error
        });

    } catch (error) {
        next(error);
    }
};


export const updateErrorByIdController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {
        
        const error = await updateErrorById(req.params.error_id as string, req.body );

        return res.status(200).json({
            success: true,
            data: error
        });

    } catch (error) {
        next(error);
    }
}


// DELETE
export const deleteErrorController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const result = await deleteErrorById(req.params.error_id as string);

        return res.status(200).json({
            success: true,
            message: "Error deleted successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};