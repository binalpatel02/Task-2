import Product from "../model/product.model.js";

// CREATE
export const createProduct = async (data: any) => {

    const existingProduct = await Product.findOne({
        product_id: data.product_id
    });

    if (existingProduct) {
        throw new Error("Product ID already exists");
    }

    const product = await Product.create({
        product_id: data.product_id,
        name: data.name,
        price: data.price,
        quantity: data.quantity
    });

    return product;
};


// GET ALL
export const getProducts = async () => {

    const products = await Product.find();

    return products;
};


// GET BY ID
export const getProductById = async (productId: string) => {

    const product = await Product.findOne({
        product_id: productId
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};


// UPDATE
export const updateProduct = async (
    productId: string,
    data: any
) => {

    const product = await Product.findOneAndUpdate(
        { product_id: productId },
        data,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};


// DELETE
export const deleteProduct = async (productId: string) => {

    const product = await Product.findOneAndDelete({
        product_id: productId
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return {
        product_id: product.product_id,
        message: "Product deleted successfully"
    };
};