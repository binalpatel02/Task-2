import { createErrorMapper } from "../mapper/error.mapper.js";
import { IError } from "@library/schema/error";
import { errorModel } from "../model/error.model.js";

export const createError = async ( data: IError ) => {

    const errorData = createErrorMapper(data);

    const error = await errorModel.add( errorData );

    return error;      
};


export const getErrors = async () => {

    const errors = await errorModel.getAll(
        {},
        {
            created_at: -1
        }
    );

    return errors;  
};


export const getErrorById = async ( errorId: string ) => {

    const error = await errorModel.get({error_id: errorId});

    if (!error) {
        throw new Error("Error not found");
    }

    return error;
};


// UPDATE
export const updateErrorById = async (errorId: string, data: any) => {
    
    const error = await errorModel.update({error_id: errorId}, data);

    if(!error) {
        throw new Error("Error not found");
    }

    return error;
}


// DELETE 
export const deleteErrorById = async ( errorId: string ) => {

    const error = await errorModel.delete( {error_id: errorId} );

    if (!error) {
        throw new Error("Error not found");
    }

    return error;
};