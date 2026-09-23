import { OrderItem } from "@library/schema/order";
import { BaseModel } from "@library/shared";

export class OrderItemModel extends BaseModel<any> {

    constructor() {
        super(
            OrderItem,
            {
                return_doc: true
            }
        )
    }
}

export const orderItemModel = new OrderItemModel();