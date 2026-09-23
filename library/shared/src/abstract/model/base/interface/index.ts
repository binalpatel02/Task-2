export interface IModelOptions {
    disable_delete?: boolean;
    disable_update?: boolean;
    disable_status?: boolean;

    enable_auto?: boolean;

    exclusion?: Record<string, number>;

    hard_delete?: boolean;

    indexed_fields?: string[];

    lookup_fields?: Record<string, number>;

    return_doc?: boolean;
}