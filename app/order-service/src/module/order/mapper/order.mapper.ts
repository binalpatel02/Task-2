export const orderResponseMapper = (order: any) => {
    return {
        order_id: order.order_id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        order_status: order.order_status,
        created_at: order.created_at,
        updated_at: order.updated_at
    };
};