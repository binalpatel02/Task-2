import ErrorModel from "../model/error.model.js";

import { createErrorMapper, errorResponseMapper } from "../mapper/error.mapper.js";

import type { ICreateError } from "../interface/error.interface.js";


export const createError = async ( data: ICreateError ) => {

    const errorData = createErrorMapper(data);

    const error = await ErrorModel.create( errorData );

    return errorResponseMapper(error);
};


export const getErrors = async () => {

    const errors = await ErrorModel
        .find()
        .sort({
            created_at: -1
        });

    return errors.map( errorResponseMapper );
};


export const getErrorById = async ( errorId: string ) => {

    const error = await ErrorModel.findById(errorId);

    if (!error) {
        throw new Error("Error not found");
    }

    return errorResponseMapper(error);
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

    return errorResponseMapper(error);
}


// DELETE 
export const deleteErrorById = async ( errorId: string ) => {

    const error = await ErrorModel.findByIdAndDelete( errorId );

    if (!error) {
        throw new Error("Error not found");
    }

    return errorResponseMapper(error);
};