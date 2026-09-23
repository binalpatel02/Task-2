import { orderModel } from "../model/order.model.js";
import { orderItemModel } from "../../orderItem/index.js";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://127.0.0.1:3000";


const checkUserExists = async (
    userId: string,
    token?: string
) => {
    try {
        const response = await fetch(
            `${USER_SERVICE_URL}/api/v1/users/${userId}`,
            {
                headers: {
                    Authorization: token ? token : ""
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `User not found (Status: ${response.status})`
            );
        }

        const result = await response.json();

        return result.data;
    }

    catch (error: any) {

        if (
            error.cause?.code === "ECONNREFUSED" ||
            error.name === "TypeError"
        ) {
            throw new Error(
                `Unable to connect to User Service at ${USER_SERVICE_URL}`
            );
        }

        throw error;
    }
};


const calculateOrderTotal = async (
    orderId: string
): Promise<number> => {

    const result = await orderItemModel.aggregate([
        {
            $match: {
                _id: orderId
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

    if (
        !result ||
        result.length === 0
    ) {
        return 0;
    }

    return Math.max(
        0,
        Number(result[0].total_amount) || 0
    );
};


export const updateOrderTotal = async (
    orderId: string
) => {

    const totalAmount =
        await calculateOrderTotal(orderId);

    const order = await orderModel.update(
        {
            _id: orderId
        },
        {
            total_amount: totalAmount
        }
    );

    if (!order) {

        const error =
            new Error("Order not found") as any;

        error.statusCode = 404;

        throw error;
    }

    return order;
};


export const createOrder = async (
    data: any,
    token?: string
) => {

    try {

        const user = await checkUserExists(
            data.user_id,
            token
        );

        if (!user) {

            const customError =
                new Error(
                    "The provided user_id is invalid or does not exist."
                ) as any;

            customError.statusCode = 404;

            throw customError;
        }

        const order = await orderModel.add({

            user_id: data.user_id,

            total_amount: 0,

            order_status:
                data.order_status || "PENDING"
        });


        return order;
    }

    catch (error: any) {

        if (
            error.message &&
            error.message.includes("User not found")
        ) {

            const customError =
                new Error(
                    "The provided user_id is invalid or does not exist."
                ) as any;

            customError.statusCode = 404;

            throw customError;
        }

        throw error;
    }
};


export const getOrders = async () => {

    const orders = await orderModel.getAll(
        {},
        {
            created_at: -1
        }
    );


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


    const totalMap = new Map<
        string,
        number
    >();

    for (const item of totals) {

        totalMap.set(
            String(item._id),

            Math.max(
                0,
                Number(item.total_amount) || 0
            )
        );
    }

    return orders.map((order: any) => {

        const calculatedTotal =
            totalMap.get(
                String(order.order_id)
            ) ?? 0;

        return {
            ...order.toObject
                ? order.toObject()
                : order,

            total_amount: calculatedTotal
        };
    });
};


export const getOrderById = async (
    orderId: string
) => {


    const order = await orderModel.get({
        _id: orderId
    });


    if (!order) {

        const error =
            new Error("Order not found") as any;

        error.statusCode = 404;

        throw error;
    }


    const calculatedTotal =
        await calculateOrderTotal(orderId);

    return {
        ...order.toObject
            ? order.toObject()
            : order,

        total_amount: calculatedTotal
    };
};


export const updateOrder = async (
    orderId: string,
    data: any
) => {

    const calculatedTotal =
        await calculateOrderTotal(orderId);

    const updateData = {
        ...data,

        total_amount: calculatedTotal
    };

    const order = await orderModel.update(
        {
            _id: orderId
        },

        updateData
    );


    if (!order) {

        const error =
            new Error("Order not found") as any;

        error.statusCode = 404;

        throw error;
    }


    return order;
};


export const deleteOrder = async (
    orderId: string
) => {

    const order = await orderModel.delete({
        _id: orderId
    });


    if (!order) {

        const error =
            new Error("Order not found") as any;

        error.statusCode = 404;

        throw error;
    }

    await orderItemModel.deleteMany({
        _id: orderId
    });


    return order;
};