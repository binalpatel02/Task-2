export const productResponseMapper = (product: any) => {
    return {
        product_id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at
    };
};