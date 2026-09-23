import { Product } from "@library/schema/product";
import { BaseModel } from "@library/shared";

export class ProductModel extends BaseModel<any> {
    constructor() {
        super(Product, {
            return_doc: true
        });
    }
}

export const productModel = new ProductModel();