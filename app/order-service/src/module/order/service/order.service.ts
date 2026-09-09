import Order from "../model/order.model.js";

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


// CREATE
export const createOrder = async (data: any, token?: string) => {
    try {
        const user = await checkUserExists(data.user_id, token);

        const order = await Order.create({
            user_id: data.user_id,
            total_amount: data.total_amount,
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
    return await Order.find().sort({ created_at: -1 });
};


// GET BY ID
export const getOrderById = async ( orderId: string ) => {

    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");

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

    if (!order) throw new Error("Order not found");
    return order;
};

 
// DELETE
export const deleteOrder = async ( orderId: string ) => {

    const order = await Order.findByIdAndDelete( orderId );

    if (!order) throw new Error("Order not found");

    return order;
};