import OrderItem from "../model/orderItem.model.js";
import Order from "../../order/model/order.model.js";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://127.0.0.1:3001";

//  Updated to receive the token parameter
const checkProductExists = async (productId: string, token?: string) => {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`, {
            headers: {
                //  Forward the Bearer token to authorize the internal fetch call
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
// accept the token forwarded by the controller
export const createOrderItem = async (data: any, token?: string) => {
    const order = await Order.findById(data.order_id);

    if (!order) {
        throw new Error("Order not found");
    }

    // Pass the token directly into the validation checker
    const product = await checkProductExists(data.product_id, token);
    const unitPrice = product.price;
    const subtotal = data.quantity * unitPrice;

    const orderItem = await OrderItem.create({
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: unitPrice,
        subtotal
    });

    return orderItem;
};

// GET ALL
export const getOrderItems = async () => {
    return await OrderItem.find().sort({ created_at: -1 });
};

// GET BY ID 
export const getOrderItemById = async (orderItemId: string) => {
    const orderItem = await OrderItem.findById(orderItemId);

    if (!orderItem) {
        throw new Error("Order item not found");
    }

    return orderItem;
};

// UPDATE
export const updateOrderItem = async (orderItemId: string, data: any) => {
    const existingItem = await OrderItem.findById(orderItemId);

    if (!existingItem) {
        throw new Error("Order item not found");
    }

    const quantity = data.quantity ?? existingItem.quantity;
    const unitPrice = data.unit_price ?? existingItem.unit_price;
    const subtotal = quantity * unitPrice;

    const orderItem = await OrderItem.findByIdAndUpdate(
        orderItemId,
        {
            ...data,
            subtotal
        },
        {
            returnDocument: "after", 
            runValidators: true
        }
    );

    return orderItem;
};

// DELETE
export const deleteOrderItem = async (orderItemId: string) => {
    const orderItem = await OrderItem.findByIdAndDelete(orderItemId);

    if (!orderItem) {
        throw new Error("Order item not found");
    }

    return orderItem;
};
