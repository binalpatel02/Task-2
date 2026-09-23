import { Order } from "@library/schema/order";
import { BaseModel } from "@library/shared"

export class OrderModel extends BaseModel<any> {

    constructor() {
        super(
            Order,
            {
               return_doc: true
            }
        )
    }
}

export const orderModel = new OrderModel();