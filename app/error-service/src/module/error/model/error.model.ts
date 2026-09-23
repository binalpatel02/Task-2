import { Error } from "@library/schema/error";
import { BaseModel } from "@library/shared";

export class ErrorModel extends BaseModel<any> {

    constructor() {
        super(
            Error,
            {
                return_doc: true
            }
        )
    }
}

export const errorModel = new ErrorModel();