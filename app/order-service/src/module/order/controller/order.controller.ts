import type { Request, Response, NextFunction } from "express";
import { orderService } from "../service/order.service.js";
import { createOrderValidator, updateOrderValidator } from "../validator/order.validator.js";
import { AbstractController, IController } from "@library/shared";

// CREATE
export class CreateOrderController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const { error } = createOrderValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const token = req.headers.authorization;
        
            const order = await orderService.createOrder(req.body, token);

            const response = this.created(order);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order created successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    }
};


// GET ALL
export class GetOrdersController extends AbstractController implements IController{
    async execute( _req: Request, res: Response, next: NextFunction ) {

        try {

            const orders = await orderService.getOrders();

            const response = this.success(orders);

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}
 

// GET BY ID
export class GetOrderByIdController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const order = await orderService.getOrderById(req.params.order_id as string);

            const response = this.success(order);

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}


// UPDATE
export class UpdateOrderController extends AbstractController implements IController{ 
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const { error } = updateOrderValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const token = req.headers.authorization;

            const order = await orderService.updateOrder(
                req.params.order_id as string,
                req.body,
                token
            );

            const response = this.success(order);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order updated successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}


// DELETE
export class DeleteOrderController extends AbstractController implements IController{
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const token = req.headers.authorization;

            const order = await orderService.deleteOrder(
                req.params.order_id as string,
                token
            );

            const response = this.success(order);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order deleted successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    };
}

export const createOrderController = new CreateOrderController();
export const getOrdersController = new GetOrdersController();
export const getOrderByIdController = new GetOrderByIdController();
export const updateOrderController = new UpdateOrderController();
export const deleteOrderController = new DeleteOrderController();