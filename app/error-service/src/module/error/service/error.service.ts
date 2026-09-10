import ErrorModel from "../model/error.model.js";

import { createErrorMapper } from "../mapper/error.mapper.js";

import { IError } from "@library/schema/error";

export const createError = async ( data: IError ) => {

    const errorData = createErrorMapper(data);

    const error = await ErrorModel.create( errorData );

    return error;      
};


export const getErrors = async () => {

    const errors = await ErrorModel
        .find()
        .sort({
            created_at: -1
        });

    return errors;  
};


export const getErrorById = async ( errorId: string ) => {

    const error = await ErrorModel.findById(errorId);

    if (!error) {
        throw new Error("Error not found");
    }

    return error;
};


// UPDATE
export const updateErrorById = async (errorId: string, data: any) => {
    
    const error = await ErrorModel.findByIdAndUpdate(errorId, data ,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if(!error) {
        throw new Error("Error not found");
    }

    return error;
}


// DELETE 
export const deleteErrorById = async ( errorId: string ) => {

    const error = await ErrorModel.findByIdAndDelete( errorId );

    if (!error) {
        throw new Error("Error not found");
    }

    return error;
};