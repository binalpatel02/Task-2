import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../service/product.service.js";

import {
    createProductValidator,
    updateProductValidator
} from "../validator/product.validator.js";

import {
    productResponseMapper
} from "../mapper/product.mapper.js";


// CREATE
export const createProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { error } =
            createProductValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const product = await createProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: productResponseMapper(product)
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL
export const getProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const products = await getProducts();

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        return res.status(200).json({
            success: true,
            data: products.map(productResponseMapper)
        });

    } catch (error) {
        next(error);
    }
};


// GET BY ID
export const getProductByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { product_id } = req.params;

        const product =
            await getProductById(product_id as string);

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: productResponseMapper(product)
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE
export const updateProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { error } =
            updateProductValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { product_id } = req.params;

        const product =
            await updateProduct(product_id as string, req.body);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: productResponseMapper(product)
        });

    } catch (error) {
        next(error);
    }
};


// DELETE
export const deleteProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { product_id } = req.params;

        const result =
            await deleteProduct(product_id as string);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};