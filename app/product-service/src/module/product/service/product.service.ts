import Product from "../model/product.model.js";

// CREATE
export const createProduct = async (data: any) => {

    const product = await Product.create({
        name: data.name,
        price: data.price,
        quantity: data.quantity
    });

    return product;
};


// GET ALL
export const getProducts = async () => {

    return await Product.find()
        .sort({ created_at: -1 });
};


// GET BY ID
export const getProductById = async ( productId: string ) => {

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};


// UPDATE
export const updateProduct = async ( productId: string, data: any ) => {

    const product = await Product.findByIdAndUpdate( productId, data,
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
export const deleteProduct = async ( productId: string ) => {

    const product = await Product.findByIdAndDelete( productId );

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};