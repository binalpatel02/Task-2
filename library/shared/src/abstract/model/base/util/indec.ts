export interface IQueryOptions {
    filter? : Record<string, unknown>;
    projection? : Record<string, number>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
}

export class AbstractUtil {

    prepareFilter(
        filter: Record<string, unknown> = {}
    ) {
        return filter
    } 

    prepareProjection(
        projection: Record<string, number> = {}
    ) {
        return projection
    }

    prepareSort(
        sort: Record<string, 1| -1> = {}
    ) {
        return sort
    }

    preparePagination(
        skip = 0,
        limit = 20
    ) {
        return {
            skip, limit
        }
    }
}