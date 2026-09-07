import Order from "../model/order.model.js";


// CREATE
export const createOrder = async (data: any) => {

    const order = await Order.create({
        user_id: data.user_id,
        total_amount: data.total_amount,
        order_status: data.order_status || "PENDING"
    });

    return order;
};


// GET ALL
export const getOrders = async () => {

    return await Order.find()
        .sort({ created_at: -1 });
};


// GET BY ID
export const getOrderById = async ( orderId: string ) => {

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
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
        throw new Error("Order not found");
    }

    return order;
};

 
// DELETE
export const deleteOrder = async ( orderId: string ) => {

    const order = await Order.findByIdAndDelete( orderId );

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};