export abstract class AbstractController {
    protected success<T>(
        data: T,
        statusCode = 200
    ) {
        return {
            statusCode,
            data
        };
    }

    protected created<T> (data: T) {
        return {
            statusCode: 201,
            data
        };
    }
}