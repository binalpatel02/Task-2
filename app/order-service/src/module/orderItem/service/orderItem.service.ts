import OrderItem from "../model/orderItem.model.js";
import Order from "../../order/model/order.model.js";
import { updateOrderTotal } from "../../order/service/order.service.js";

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

// CREATE
export const createOrderItem = async (data: any, token?: string) => {
    // Check Order
    const order = await Order.findById(data.order_id);

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    // Check Product
    const product = await checkProductExists( data.product_id,  token );
    // Calculate subtotal
    const subtotal = Number(data.quantity) *  Number(product.price);

    // Create OrderItem
    const orderItem = await OrderItem.create({
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: product.price,
        subtotal
    });

    // Recalculate Order total
    await updateOrderTotal(data.order_id);

    return orderItem;
};

// GET ALL
export const getOrderItems = async () => {
    return await OrderItem.find() .sort({ created_at: -1 });
};

// GET BY ID
export const getOrderItemById = async (orderItemId: string) => {
    const orderItem = await OrderItem.findById(orderItemId);

    if (!orderItem) {
        const error = new Error("Order item not found") as any;
        error.statusCode = 404;
        throw error;
    }

    return orderItem;
};

// UPDATE
export const updateOrderItem = async (orderItemId: string, data: any) => {
    const existingItem = await OrderItem.findById(orderItemId);

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

    // If order_id is changed, make sure new order exists
    if (newOrderId !== oldOrderId) {

        const newOrder = await Order.findById(newOrderId);

        if (!newOrder) {
            const error = new Error("New order not found") as any;
            error.statusCode = 404;
            throw error;
        }
    }

    const orderItem = await OrderItem.findByIdAndUpdate(
            orderItemId,
            {
                ...data,
                order_id: newOrderId,
                quantity,
                unit_price: unitPrice,
                subtotal
            },
            {
                returnDocument: "after",
                runValidators: true
            }
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
export const deleteOrderItem = async (orderItemId: string) => {
    const orderItem = await OrderItem.findById(orderItemId);

    if (!orderItem) {
        const error = new Error( "Order item not found") as any;
        error.statusCode = 404;
        throw error;
    }

    const orderId = orderItem.order_id;

    await OrderItem.findByIdAndDelete(
        orderItemId
    );

    // Recalculate after deletion
    await updateOrderTotal(orderId);

    return orderItem;
};
