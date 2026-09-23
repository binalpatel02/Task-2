import { IService, IServiceQuery, IServiceModel } from "../interface/index.js";

export abstract class AbstractService<T>
    implements IService<T> {

    constructor(
        protected readonly model: IServiceModel<T>,
        protected readonly idField: string
    ) {}

    async create(data: Partial<T>): Promise<T> {
        return this.model.add(data);
    }

    async getById(id: string): Promise<T | null> {
        return this.model.get({
            [this.idField]: id
        });
    }

    async getAll( query?: IServiceQuery ): Promise<T[]> {
        return this.model.getAll(
            query?.filter ?? {}
        );
    }

    async update( id: string, data: Partial<T> ): Promise<T | null> {
        return this.model.update(
            {
                [this.idField]: id
            },
            data
        );
    }

    async delete( id: string ): Promise<T | null> {
        return this.model.delete({
            [this.idField]: id
        });
    }
}