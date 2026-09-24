export interface IServiceQuery {
    filter?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
}

export interface IService<T, Id=string> {
    create(
        data: Partial<T>
    ): Promise<T>

    getById(
        id: Id
    ): Promise<T | null>

    getAll(
        query? : IServiceQuery
    ): Promise<T[]>

    update(
        id: Id,
        data: Partial<T>
    ): Promise<T | null>

    delete(
        id: Id
    ): Promise<T | null>;
}

export interface IServiceModel<T> {
    add(data: Partial<T>): Promise<T>;

    get(
        filter: Record<string, unknown>
    ): Promise<T | null>;

    getAll(
        filter?: Record<string, unknown>,
        sort?: Record<string, 1 | -1>
    ): Promise<T[]>;

    update(
        filter: Record<string, unknown>,
        data: Partial<T>
    ): Promise<T | null>;

    delete(
        filter: Record<string, unknown>
    ): Promise<T | null>;
}