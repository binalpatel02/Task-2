import type { Request, Response, NextFunction } from "express";
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } from "../service/order.service.js";
import { createOrderValidator, updateOrderValidator } from "../validator/order.validator.js";

// CREATE
export const createOrderController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { error } = createOrderValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const token = req.headers.authorization;
        
        const order = await createOrder(req.body, token);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL
export const getOrdersController = async ( _req: Request, res: Response, next: NextFunction ) => {

    try {

        const orders = await getOrders();

        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        next(error);
    }
};
 

// GET BY ID
export const getOrderByIdController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const order = await getOrderById(req.params.order_id as string);

        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE
export const updateOrderController = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { error } = updateOrderValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const order = await updateOrder( req.params.order_id as string, req.body );

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order
        });

    } catch (error) {
        next(error);
    }
};


// DELETE
export const deleteOrderController = async ( req: Request, res: Response, next: NextFunction
) => {

    try {

        const order = await deleteOrder(req.params.order_id as string);

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order
        });

    } catch (error) {
        next(error);
    }
};