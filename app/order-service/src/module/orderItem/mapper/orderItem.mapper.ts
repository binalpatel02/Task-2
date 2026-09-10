export const orderItemResponseMapper = ( orderItem: any ) => {

    return {
        order_item_id: orderItem._id,
        order_id: orderItem.order_id,
        product_id: orderItem.product_id,
        quantity: orderItem.quantity,
        unit_price: orderItem.unit_price,
        subtotal: orderItem.subtotal,
        created_at: orderItem.created_at,
        updated_at: orderItem.updated_at
    };
};