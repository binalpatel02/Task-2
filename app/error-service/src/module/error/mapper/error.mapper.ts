import type { ICreateError, IErrorResponse } from "../interface/error.interface.js";


// Request → Database
export const createErrorMapper = ( data: ICreateError ) => {

    return {
        method: data.method,
        url: data.url,
        header: data.header ?? {},
        extra: data.extra ?? {},
        data: data.data ?? {}
    };
};


// Database → Response
export const errorResponseMapper = ( error: any ): IErrorResponse => {

    return {
        method: error.method,
        url: error.url,
        header: error.header ?? {},
        extra: error.extra ?? {},
        data: error.data ?? {},
        created_at: error.created_at
    };
};