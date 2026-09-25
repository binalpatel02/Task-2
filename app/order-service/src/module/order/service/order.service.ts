import { orderModel } from "../model/order.model.js";
import { orderItemModel } from "../../orderItem/index.js";
import { AbstractService } from "@library/shared";
import type { IOrder } from "@library/schema/order";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://127.0.0.1:3000";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://127.0.0.1:3001";

// Check user exists
const checkUserExists = async ( userId: string, token?: string ) => {
    try {
        const response = await fetch( `${USER_SERVICE_URL}/api/v1/users/${userId}`,
            {
                headers: {
                    Authorization: token ? token : ""
                }
            }
        );

        if (!response.ok) {
            throw new Error( `User not found (Status: ${response.status})` );
        }

        const result = await response.json();

        return result.data;
    }

    catch (error: any) {
        if (
            error.cause?.code === "ECONNREFUSED" ||
            error.name === "TypeError"
        ) {
            throw new Error(`Unable to connect to User Service at ${USER_SERVICE_URL}`);
        }
        throw error;
    }
};


// Restore product stock
const restoreProductStock = async ( productId: string, quantity: number, token?: string ) => {

    try {

        const response = await fetch(
            `${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,
            {
                headers: {
                    Authorization: token ? token : ""
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Product not found (Status: ${response.status})`
            );
        }

        const result = await response.json();

        const product = result.data;

        const currentQuantity = Number(product.quantity);
        const newQuantity = currentQuantity + Number(quantity);

        const updateResponse = await fetch(
            `${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? token : ""
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            }
        );

        if (!updateResponse.ok) {
            throw new Error(
                `Failed to restore product stock (Status: ${updateResponse.status})`
            );
        }

        return newQuantity;
    }

    catch (error: any) {

        if (
            error.cause?.code === "ECONNREFUSED" ||
            error.name === "TypeError"
        ) {
            throw new Error(
                `Unable to connect to Product Service at ${PRODUCT_SERVICE_URL}`
            );
        }

        throw error;
    }
};


// Calculate total order
const calculateOrderTotal = async ( orderId: string ): Promise<number> => {

    const result = await orderItemModel.aggregate([
        {
            $match: {
                order_id: orderId
            }
        },

        {
            $group: {
                _id: "$order_id",

                total_amount: {
                    $sum: "$subtotal"
                }
            }
        }
    ]);

    if ( !result || result.length === 0 ) {
        return 0;
    }

    return Math.max( 0, Number(result[0].total_amount) || 0 );
};


// Update total order
export const updateOrderTotal = async ( orderId: string ) => {

    const totalAmount = await calculateOrderTotal(orderId);

    const order = await orderModel.update(
        {
            _id: orderId
        },
        {
            total_amount: totalAmount
        }
    );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    return order;
};


export class OrderService extends AbstractService<IOrder> {

    constructor() {
        super(orderModel, "_id");
    }


    // CREATE
    async createOrder( data: any, token?: string ) {

        try {

            const user = await checkUserExists( data.user_id, token );

            if (!user) {
                const customError = new Error("The provided user_id is invalid or does not exist.") as any;
                customError.statusCode = 404;
                throw customError;
            }

            const order = await this.create({
                user_id: data.user_id,
                total_amount: 0,
                order_status: data.order_status || "PENDING"
            });

            return order;
        }

        catch (error: any) {

            if ( error.message && error.message.includes("User not found")) {
                const customError = new Error("The provided user_id is invalid or does not exist.") as any;
                customError.statusCode = 404;
                throw customError;
            }

            throw error;
        }
    };


    // GET ALL
    async getOrders() {

        const orders = await this.getAll({
            sort: {
                created_at: -1
            }
        });

        const totals = await orderItemModel.aggregate([
            {
                $group: {
                    _id: "$order_id",

                    total_amount: {
                        $sum: "$subtotal"
                    }
                }
            }
        ]);

        const totalMap = new Map<string, number>();

        for (const item of totals) {
            totalMap.set(
                String(item._id),
                Math.max( 0, Number(item.total_amount) || 0 )
            );
        }

        return orders.map((order: any) => {

            const orderData = order.toObject ? order.toObject() : order;
            const calculatedTotal = totalMap.get( String(order.order_id ?? order._id) ) ?? 0;

            return {
                ...orderData,
                total_amount: calculatedTotal
            };
        });
    };


    // GET BY ID
    async getOrderById( orderId: string ) {

        const order = await this.getById(orderId);

        if (!order) {
            const error = new Error("Order not found") as any;
            error.statusCode = 404;
            throw error;
        }

        const calculatedTotal = await calculateOrderTotal(orderId);
        const orderData = (order as any).toObject ? (order as any).toObject() : order;

        return {
            ...orderData,
            total_amount: calculatedTotal
        };
    };


    // UPDATE
    async updateOrder( orderId: string, data: any, token?: string ) {

    const existingOrder = await this.getById(orderId);

    if (!existingOrder) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    const oldStatus = existingOrder.order_status;
    const newStatus = data.order_status ?? oldStatus;

    // Restore Product stock when order is cancelled
    if ( oldStatus !== "CANCELLED" && newStatus === "CANCELLED" ) {

        const orderItems = await orderItemModel.getAll({ order_id: orderId });

        for (const orderItem of orderItems) {

            await restoreProductStock(
                orderItem.product_id,
                Number(orderItem.quantity),
                token
            );
        }
    }

    const calculatedTotal = await calculateOrderTotal(orderId);

    const updateData = {
        ...data,
        total_amount: calculatedTotal
    };

    const order = await this.update( orderId, updateData );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    return order;
};


    // DELETE
    async deleteOrder( orderId: string, token?: string ) {

        const order = await this.getById(orderId);

        if (!order) {
            const error = new Error("Order not found") as any;
            error.statusCode = 404;
            throw error;
        }

        const orderItems = await orderItemModel.getAll({
            order_id: orderId
        });

        // Restore Product stock
        for (const orderItem of orderItems) {

            await restoreProductStock(
                orderItem.product_id,
                Number(orderItem.quantity),
                token
            );
        }

        // Delete OrderItems
        await orderItemModel.deleteMany({
            order_id: orderId
        });

        // Delete Order
        const deletedOrder = await this.delete(orderId);

        if (!deletedOrder) {
            const error = new Error("Order deletion failed") as any;
            error.statusCode = 500;
            throw error;
        }

        return deletedOrder;
    };
}

export const orderService = new OrderService();