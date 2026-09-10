import Product from "../model/product.model.js";

// CREATE
export const createProduct = async (data: any) => {
    const productName = data.name.trim();
    const productPrice = Number(data.price);
    const incomingQuantity = data.quantity && data.quantity >= 0 ? Number(data.quantity) : 0;

    const existingProduct = await Product.findOne({ 
        name: productName, 
        price: productPrice 
    });

    if (existingProduct) {
        //  Same laptop model + same price layout -> Increment stock!
        existingProduct.quantity += incomingQuantity;
        await existingProduct.save();
        
        console.log(` Merged stock for [${productName}] at $${productPrice}. New quantity: ${existingProduct.quantity}`);
        return existingProduct;
    }

    // Same laptop model but DIFFERENT price, OR entirely new laptop name -> Create new record!
    const product = await Product.create({
        name: productName,
        price: productPrice,
        quantity: incomingQuantity
    });

    console.log(`Created a unique product slot for [${product.name}] at price point: $${product.price}`);
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
    const product = await Product.findById(productId);

    if (!product) {
       throw new Error("Product not found");

    }

    if (data.quantity !== undefined) {
        const oldQuantity = product.quantity;
        const newQuantity = Number(data.quantity);
        
        const deltaChange = newQuantity - oldQuantity;

        if (newQuantity < 0) {
            const error = new Error(`Inventory constraint rejection: Stock level updates cannot drop below zero. Current database level is ${oldQuantity}.`) as any;
            error.statusCode = 400;
            throw error;
        }

        console.log(`Quantity modification tracked for [${product.name}]: Shifted by (${deltaChange > 0 ? '+' : ''}${deltaChange}). New Total balance: ${newQuantity}`);
        product.quantity = newQuantity;
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;

    await product.save();
    return product;
};

 
// DELETE
export const deleteProduct = async ( productId: string ) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    console.log(`Removing product document [${product.name}]. Clearing out its remaining ${product.quantity} items from tracking indexes.`);
    
    await Product.findByIdAndDelete(productId);
    return product;
};