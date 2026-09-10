import Order from "../model/order.model.js";
import OrderItem from "../../orderItem/model/orderItem.model.js"; 

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://127.0.0.1:3000";

const checkUserExists = async (userId: string, token?: string) => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/api/v1/users/${userId}`, { 
            headers: {
                "Authorization": token ? token : ""
            }
        });

        if (!response.ok) {
            throw new Error(`User not found (Status: ${response.status})`);
        }

        const result = await response.json();
        return result.data;
    }
    
    catch (error: any) {
        if (error.cause?.code === "ECONNREFUSED" || error.name === "TypeError") {
            throw new Error(`Unable to connect to User Service at ${USER_SERVICE_URL}`);
        }
        throw error;
    }
};

// helper function for total_amount
export const updateOrderTotal = async (orderId: string) => {

    const result = await OrderItem.aggregate([
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

    const totalAmount =
        result.length > 0
            ? Math.max(0, result[0].total_amount)
            : 0;

    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            total_amount: totalAmount
        },
        {
            returnDocument: "after"
        }
    );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    return order;
};


// CREATE
export const createOrder = async (data: any, token?: string) => {
    try {
        const user = await checkUserExists(data.user_id, token);

        const order = await Order.create({
            user_id: data.user_id,
            total_amount: 0, 
            order_status: data.order_status || "PENDING"
        });

        return order;

    } catch (error: any) {
        if (error.message.includes("User not found")) {
            const customError = new Error("The provided user_id is invalid or does not exist.") as any;
            customError.statusCode = 404; 
            throw customError;
        }
        
        throw error;
    }
};


// GET ALL
export const getOrders = async () => {
    const orders = await Order.find().sort({ created_at: -1 });

    // Dynamically sync totals for all listed orders before responding
    const syncedOrders = await Promise.all(orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id });
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        
        order.total_amount = total;
        await order.save();
        return order;
    }));

    return syncedOrders;
};


// GET BY ID
export const getOrderById = async ( orderId: string ) => {
    // Fetch all items matching this order ID
    const items = await OrderItem.find({ order_id: orderId });

    // Calculate the total amount sum
    const calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Update the total_amount in the database right before returning it
    const order = await Order.findByIdAndUpdate(
        orderId,
        { total_amount: calculatedTotal },
        { returnDocument: "after" }
    );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    return order;
};


// UPDATE
export const updateOrder = async ( orderId: string, data: any ) => {

    const order = await Order.findByIdAndUpdate( orderId, data,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    // Recalculate total after update to ensure integrity
    const items = await OrderItem.find({ order_id: orderId });
    const calculatedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    order.total_amount = calculatedTotal;
    await order.save();

    return order;
};

 
// DELETE
export const deleteOrder = async ( orderId: string ) => {

    const order = await Order.findByIdAndDelete( orderId );

    if (!order) {
        const error = new Error("Order not found") as any;
        error.statusCode = 404;
        throw error;
    }

    await OrderItem.deleteMany({ order_id: orderId });

    return order;
};