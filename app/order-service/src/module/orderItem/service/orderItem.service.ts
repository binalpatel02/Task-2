import { orderModel } from "../../order/model/order.model.js";
import { orderItemModel } from "../model/orderItem.model.js";
import { updateOrderTotal } from "../../order/service/order.service.js";
import { AbstractService } from "@library/shared";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://127.0.0.1:3001";

// Helper function to check if the product exists in Product Service
const checkProductExists = async (productId: string, token?: string) => {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`, {
            headers: {
                "Authorization": token ? token : ""
            }
        });

        if (!response.ok) {
            throw new Error(`Product not found (Status: ${response.status})`);
        }

        const result = await response.json();
        return result.data;
    }
    
    catch (error: any) {
        if (error.cause?.code === "ECONNREFUSED" || error.name === "TypeError") {
            throw new Error(`Unable to connect to Product Service at ${PRODUCT_SERVICE_URL}`);
        }
        throw error;
    }
};


export class OrderItemService extends AbstractService <any> {

    constructor() {
        super(orderItemModel, "_id");
    }

    
    // CREATE
    async createOrderItem(data: any, token?: string) {
        // Check Order
        const order = await orderModel.get({_id: data.order_id});

        if (!order) {
            const error = new Error("Order not found") as any;
            error.statusCode = 404;
            throw error;
        }

        // Check Product
        const product = await checkProductExists( data.product_id,  token );
        const requestedQuantity = Number(data.quantity);
        const availableQuantity = Number(product.quantity);
    
        if (requestedQuantity > availableQuantity) {
            const error = new Error( `Insufficient stock. Requested: ${requestedQuantity}, Available: ${availableQuantity}` ) as any;
            error.statusCode = 400;
            throw error;
        }

        const subtotal = requestedQuantity * Number(product.price);
        // Create OrderItem
        const orderItem = await this.create({
            order_id: data.order_id,
            product_id: data.product_id,
            quantity: requestedQuantity,
            unit_price: Number(product.price),
            subtotal
        });

        const newQuantity = availableQuantity - requestedQuantity;

        const response = await fetch( `${PRODUCT_SERVICE_URL}/api/v1/products/${data.product_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? token : ""
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            }
        );

        if (!response.ok) {
            // If stock update failed, remove the Order Item that we just created
            await orderItemModel.delete({_id: orderItem._id });
            const error = new Error( `Failed to update product stock (Status: ${response.status})` ) as any;
            error.statusCode = 500;   
            throw error;
        }

        await updateOrderTotal(data.order_id);

        return orderItem;
    };


    // GET ALL
    async getOrderItems()  {    
        return await this.getAll({    
            sort: {
                created_at: -1
            }
        });
    };


    // GET BY ID
    async getOrderItemById(orderItemId: string) {
        const orderItem = await this.getById(orderItemId);

        if (!orderItem) {
            const error = new Error("Order item not found") as any;
            error.statusCode = 404;
            throw error;
        }

        return orderItem;
    };


    // UPDATE
    async updateOrderItem(orderItemId: string, data: any)  {
        const existingItem = await this.getById(orderItemId);

        if (!existingItem) {
            const error = new Error("Order item not found") as any;
            error.statusCode = 404;
            throw error;
        }

        const oldOrderId = existingItem.order_id;
        const quantity = data.quantity ?? existingItem.quantity;
        const unitPrice = data.unit_price ?? existingItem.unit_price;

        if (quantity < 0 || unitPrice < 0) {
            const error = new Error("Quantity and unit price cannot be negative") as any;
            error.statusCode = 400;
            throw error;
        }

        const subtotal = Number(quantity) * Number(unitPrice);
        const newOrderId =  data.order_id ?? existingItem.order_id;

        // If order_id is changed, check new order exists
        if (newOrderId !== oldOrderId) {
            const newOrder = await orderModel.get({_id: newOrderId});

            if (!newOrder) {
                const error = new Error("New order not found") as any;
                error.statusCode = 404;
                throw error;
            }
        }

        const orderItem = await this.update(
                orderItemId,
                {
                    ...data,
                    order_id: newOrderId,
                    quantity,
                    unit_price: unitPrice,
                    subtotal
                },
            );

        // Recalculate old order
        await updateOrderTotal(oldOrderId);

        // If moved to another order,
        // recalculate the new order too
        if (newOrderId !== oldOrderId) {
            await updateOrderTotal(newOrderId);
        }

        return orderItem;
    };


    // DELETE
    async deleteOrderItem(orderItemId: string)  {
        const orderItem = await this.getById(orderItemId);

        if (!orderItem) {
            const error = new Error( "Order item not found") as any;
            error.statusCode = 404;
            throw error;
        }

        const orderId = orderItem.order_id;

        await this.delete(orderItemId);

        // Recalculate after deletion
        await updateOrderTotal(orderId);

        return orderItem;
    };
}

export const orderItemService = new OrderItemService();