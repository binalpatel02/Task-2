import { AbstractService } from "@library/shared";
import { IError } from "@library/schema/error";
import { createErrorMapper } from "../mapper/error.mapper.js";
import { errorModel } from "../model/error.model.js";

export class ErrorService extends AbstractService<any> {

    constructor() {
        super(errorModel, "_id");
    }


    // CREATE
    async createError(data: IError) {

        const errorData = createErrorMapper(data);

        const error = await super.create(errorData);

        return error;
    }


    // GET ALL
    async getErrors() {

        const errors = await errorModel.getAll(
            {},
            {
                created_at: -1
            }
        );

        return errors;
    }


    // GET BY ID
    async getErrorById(errorId: string) {

        const error = await errorModel.get({
            error_id: errorId
        });

        if (!error) {
            throw new Error("Error not found");
        }

        return error;
    }


    // UPDATE
    async updateErrorById( errorId: string, data: any) {

        const error = await errorModel.update(
            {
                error_id: errorId
            },
            data
        );

        if (!error) {
            throw new Error("Error not found");
        }

        return error;
    }


    // DELETE
    async deleteErrorById(errorId: string) {

        const error = await errorModel.delete({
            error_id: errorId
        });

        if (!error) {
            throw new Error("Error not found");
        }

        return error;
    }
}

export const errorService = new ErrorService();