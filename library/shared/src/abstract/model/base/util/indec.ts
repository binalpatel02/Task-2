export interface IQueryOptions {
    filter? : Record<string, unknown>;
}

export class AbstractUtil {

    prepareFilter(
        filter: Record<string, unknown> = {}
    ) {
        return filter
    } 

}