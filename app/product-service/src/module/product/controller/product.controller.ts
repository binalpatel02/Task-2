import type { NextFunction, Request, Response } from "express";
import { productService } from "../service/product.service.js";
import { createProductValidator, updateProductValidator } from "../validator/product.validator.js";
import { productResponseMapper } from "../mapper/product.mapper.js";
import { AbstractController, type IController } from "@library/shared"; 

// CREATE
export class CreateProductController extends AbstractController implements IController {

    async execute ( req: Request, res: Response, next: NextFunction ) {

        try {

            const { error } = createProductValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const product = await productService.create(req.body);

            const response = this.created(productResponseMapper(product));

            return res.status(response.statusCode).json({
                success: true,
                message: "Product created successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
}};


// GET ALL
export class GetProductsController extends AbstractController implements IController {
    async execute ( req: Request, res: Response, next: NextFunction ) {

        try {

            const products = await productService.getAll();

            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No products found"
                });
            }

            const response = this.success(products.map(productResponseMapper));

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });

        } catch (error) {
            next(error);
        }
}};


// GET BY ID
export class GetProductByIdController extends AbstractController implements IController {
    async execute ( req: Request, res: Response, next: NextFunction ) {

        try {
    
            const product = await productService.getById(req.params.product_id as string);

            const response = this.success(productResponseMapper(product));
    
            return res.status(response.statusCode).json({
                success: true,
                message: "Product fetched successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
}};


// UPDATE
export class UpdateProductController extends AbstractController implements IController{
    async execute ( req: Request, res: Response, next: NextFunction )  {

        try {

            const { error } = updateProductValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const product = await productService.update(req.params.product_id as string, req.body);

            const response = this.success(productResponseMapper(product));

            return res.status(response.statusCode).json({
                success: true,
                message: "Product updated successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
}};


// DELETE
export class DeleteProductController extends AbstractController implements IController { 
    async execute ( req: Request, res: Response, next: NextFunction ) {

        try {

            const result = await productService.delete(req.params.product_id as string);

            const response = this.success(result);

            return res.status(response.statusCode).json({
                success: true,
                message: "Product deleted successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
}};

export const createProductController = new CreateProductController();

export const getProductsController = new GetProductsController();

export const getProductByIdController = new GetProductByIdController();

export const updateProductController = new UpdateProductController();

export const deleteProductController = new DeleteProductController();