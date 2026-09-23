import { publishKafkaMessage } from "@library/third-party/kafka";
import { PRODUCT_TOPICS } from "../../../library/kafka/topic.js";
import { productModel } from "../model/product.model.js";
import { AbstractService } from "@library/shared";

export class ProductService extends AbstractService<any> {

    constructor() {
        super(productModel, "_id");
    }

    // CREATE
    async create(data: any) {

        const productName = data.name.trim();
        const productPrice = Number(data.price);
        const incomingQuantity = data.quantity && data.quantity >= 0 ? Number(data.quantity) : 0;

        const existingProduct = await productModel.get({
            name: productName,
            price: productPrice
        });

        if (existingProduct) {

            existingProduct.quantity += incomingQuantity;
            await existingProduct.save();

            console.log(` Merged stock for [${productName}] at $${productPrice}. New quantity: ${existingProduct.quantity}`);
            return existingProduct;
        }

        const product = await super.create({
            name: productName,
            price: productPrice,
            quantity: incomingQuantity
        });

        await publishKafkaMessage(
            PRODUCT_TOPICS.CREATED,
            {
                product_id: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: product.quantity
            },
            product._id.toString()
        );

        console.log(`Created a unique product slot for [${product.name}] at price point: $${product.price}`);
        return product;
    }


    // GET ALL
    async getAll() {

        return await productModel.getAll(
            {},
            {
                created_at: -1
            }
        );
    }


    // GET BY ID
    async getById(productId: string) {

        const product = await super.getById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }


    // UPDATE
    async update(productId: string, data: any) {

        const product = await super.getById(productId);

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
        }

        const updatedProduct = await super.update( productId, data );

        if (!updatedProduct) {
            throw new Error("Product update failed");
        }

        await publishKafkaMessage(
            PRODUCT_TOPICS.UPDATED,
            {
                product_id: updatedProduct._id.toString(),
                name: updatedProduct.name,
                price: updatedProduct.price,
                quantity: updatedProduct.quantity
            },
            productId
        );

        return updatedProduct;
    }


    // DELETE
    async delete(productId: string) {

        const product = await super.getById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        console.log(
            `Removing product document [${product.name}]. Clearing out its remaining ${product.quantity} items from tracking indexes.`
        );

        const deletedProduct = await super.delete(productId);

        if (!deletedProduct) {
            throw new Error("Product deletion failed");
        }

        await publishKafkaMessage(
            PRODUCT_TOPICS.DELETED,
            {
                product_id: deletedProduct._id.toString(),
                name: deletedProduct.name,
                price: deletedProduct.price,
                quantity: deletedProduct.quantity
            },
            productId
        );

        return deletedProduct;
    }
}

export const productService = new ProductService();