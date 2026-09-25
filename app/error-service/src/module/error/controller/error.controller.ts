import type { Request, Response, NextFunction } from "express";
import { errorService } from "../service/error.service.js" 
import { createErrorValidator } from "../validator/error.validator.js";
import { AbstractController, type IController } from "@library/shared"; 


export class CreateErrorController extends AbstractController implements IController {
    async execute( req: Request, res: Response, next: NextFunction ) {

    try {

        const { error } = createErrorValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const result = await errorService.create(req.body);

        const response = this.created(result);

        return res.status(201).json({
            success: true,
            message: "Error stored successfully",
            data: response.data
        });

    } catch (error) {
        next(error);
    }
}};


export class GetErrorsController extends AbstractController implements IController{
    async execute( _req: Request, res: Response, next: NextFunction )  {

    try {

        const errors = await errorService.getAll();

        const response = this.success(errors);

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        next(error);
    }
}};


export class GetErrorByIdController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction )  {

    try {

        const error = await errorService.getById(req.params.error_id as string );

        const response = this.success(error);

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        next(error);
    }
}};


export class UpdateErrorController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction ) {

    try {
        
        const error = await errorService.update(req.params.error_id as string, req.body );

        const response = this.success(error);

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        next(error);
    }
}};


// DELETE
export class DeleteErrorController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction ) {

    try {

        const result = await errorService.delete(req.params.error_id as string);

        const response = this.success(result);

        return res.status(200).json({
            success: true,
            message: "Error deleted successfully",
            data: response.data
        });

    } catch (error) {
        next(error);
    }
}};

export const createErrorController = new CreateErrorController();

export const getErrorsController = new GetErrorsController();

export const getErrorByIdController = new GetErrorByIdController();

export const updateErrorController = new UpdateErrorController();

export const deleteErrorController = new DeleteErrorController();