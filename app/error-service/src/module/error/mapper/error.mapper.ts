// Request → Database
export const createErrorMapper = ( error: any ) => {
    return {
        error_id: error._id,
        method: error.method,
        url: error.url,
        header: error.header ?? {},
        extra: error.extra ?? {},
        data: error.data ?? {}
    };
};