import type { Model , Document, QueryFilter, UpdateQuery, PipelineStage } from 'mongoose'
import { AbstractUtil } from "../util/indec.js";
import type { IModelOptions } from "../interface/index.js";

export class BaseModel<T extends Document> {
    protected readonly model: Model<T>;
    protected readonly util: AbstractUtil;
    protected readonly options: IModelOptions;

    constructor(
        model: Model<T>,
        options: IModelOptions,
        util: AbstractUtil = new AbstractUtil()
    ) {
        this.model = model;
        this.options = options;
        this.util = util;
    }

    // CREATE
    async add(data: Partial<T>) {
        return this.model.create(data);
    }

    // GET ONE
    async get(filter: QueryFilter<T>) {
        const query = this.model.findOne(
            this.util.prepareFilter(filter)
        );

        if (this.options.exclusion) {
            query.select(this.options.exclusion);
        }
        return query.exec();
    }

    // GET ALL
    async getAll(
        filter: QueryFilter<T> = {},
        sort?: Record<string, 1 | -1>
    ) {

        const query = this.model.find(
            this.util.prepareFilter(filter)
        );

        if (sort) {
            query.sort(sort);
        }

        if (this.options.exclusion) {
            query.select(this.options.exclusion);            
        }
        return query.exec();
    }

    // UPDATE
    async update( filter: QueryFilter<T>, data: UpdateQuery<T>) {
        return this.model.findOneAndUpdate(
            this.util.prepareFilter(filter),
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).exec();
    }

    // DELETE ONE
    async delete(filter: QueryFilter<T>) {
        return this.model.findOneAndDelete(
            this.util.prepareFilter(filter)
        ).exec();
    }

    // AGGREGATE
    async aggregate<R = any>(
        pipeline: PipelineStage[]
    ): Promise<R[]> {
        return this.model.aggregate<R>(pipeline).exec();
    }

    // DELETE MANY
    async deleteMany(filter: QueryFilter<T>) {
        return this.model.deleteMany(
            this.util.prepareFilter(filter)
        ).exec();
    }
}