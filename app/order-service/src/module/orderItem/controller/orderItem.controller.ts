import type { Request, Response, NextFunction } from "express";
import { createOrderItem, getOrderItems, getOrderItemById, updateOrderItem, deleteOrderItem } from "../service/orderItem.service.js";
import { createOrderItemValidator, updateOrderItemValidator } from "../validator/orderItem.validator.js"; 

// CREATE
export const createOrderItemController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { error } = createOrderItemValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const orderItem = await createOrderItem(req.body);

        return res.status(201).json({
            success: true,
            message: "Order item created successfully",
            data: orderItem
        });

    } catch (error) {
        next(error);
    }
} 


// GET ALL
export const getOrderItemsController = async ( _req: Request, res: Response, next: NextFunction ) => {

    try {

        const orderItems = await getOrderItems();

        return res.status(200).json({
            success: true,
            data: orderItems
        });

    } catch (error) {
        next(error);
    }
};


// GET BY ID
export const getOrderItemByIdController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const orderItem = await getOrderItemById(req.params.order_item_id as string );

        return res.status(200).json({
            success: true,
            data: orderItem
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE
export const updateOrderItemController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { error } = updateOrderItemValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const orderItem = await updateOrderItem( req.params.order_item_id as string, req.body );

        return res.status(200).json({
            success: true,
            message: "Order item updated successfully",
            data: orderItem
        });

    } catch (error) {
        next(error);
    }
};


// DELETE
export const deleteOrderItemController = async ( req: Request, res: Response, next: NextFunction )  => {

    try {

        const orderItem = await deleteOrderItem(req.params.order_item_id as string );

        return res.status(200).json({
            success: true,
            message: "Order item deleted successfully",
            data: orderItem
        });

    } catch (error) {
        next(error);
    }
};