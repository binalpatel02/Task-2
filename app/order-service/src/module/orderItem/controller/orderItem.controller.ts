import type { Request, Response, NextFunction } from "express";
import { orderItemService } from "../service/orderItem.service.js";
import { createOrderItemValidator, updateOrderItemValidator } from "../validator/orderItem.validator.js"; 
import { AbstractController, IController } from "@library/shared";

// CREATE
export class CreateOrderItemController extends AbstractController implements IController{ 
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const { error } = createOrderItemValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            //  Grab the token from the incoming client request headers
            const token = req.headers.authorization;
        
            //  Pass BOTH req.body and the token to your service layer
            const orderItem = await orderItemService.createOrderItem(req.body, token);

            const response = this.created(orderItem);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order item created successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    } 
};


// GET ALL
export class GetOrderItemsController extends AbstractController implements IController{
    async execute( _req: Request, res: Response, next: NextFunction ) {

        try {

            const orderItems = await orderItemService.getOrderItems();

            const response = this.success(orderItems);

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    }
};


// GET BY ID
export class GetOrderItemByIdController extends AbstractController implements IController{ 
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const orderItem = await orderItemService.getOrderItemById(req.params.order_item_id as string );

            const response = this.success(orderItem);

            return res.status(response.statusCode).json({
                success: true,
                data: response.data
            });
        
        } catch (error) {
            next(error);
        }
    }
};


// UPDATE
export class UpdateOrderItemController extends AbstractController implements IController{ 
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            const { error } = updateOrderItemValidator.validate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            // Grab the token from the incoming client request headers
            const token = req.headers.authorization;

            // Pass req.body and token to service layer
            const orderItem = await orderItemService.updateOrderItem(
                req.params.order_item_id as string,
                req.body,
                token
            );

            const response = this.success(orderItem);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order item updated successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    }
};


// DELETE
export class DeleteOrderItemController extends AbstractController implements IController{ 
    async execute( req: Request, res: Response, next: NextFunction ) {

        try {

            // Grab the token from the incoming client request headers
            const token = req.headers.authorization;

            // Pass order item id and token to service layer
            const orderItem = await orderItemService.deleteOrderItem(
                req.params.order_item_id as string,
                token
            );

            const response = this.success(orderItem);

            return res.status(response.statusCode).json({
                success: true,
                message: "Order item deleted successfully",
                data: response.data
            });

        } catch (error) {
            next(error);
        }
    }
};


export const createOrderItemController = new CreateOrderItemController();
export const getOrderItemsController = new GetOrderItemsController();
export const getOrderItemByIdController = new GetOrderItemByIdController();
export const updateOrderItemController = new UpdateOrderItemController();
export const deleteOrderItemController = new DeleteOrderItemController();