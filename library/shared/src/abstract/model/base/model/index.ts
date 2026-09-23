import type { Model , Document, QueryFilter, UpdateQuery, PipelineStage } from 'mongoose'
import { AbstractUtil } from '../util/indec.js'
import { IModelOptions } from '../interface/index.js'

export class BaseModel<T extends Document> {
    protected readonly model: Model<T>;
    protected readonly util : AbstractUtil;
    protected readonly options: IModelOptions;

    constructor(
        model: Model<T>,
        options: IModelOptions,
        util: AbstractUtil = new AbstractUtil()
    ) {
        this.model = model,
        this.options = options,
        this.util = util
    }

    async add(data: Partial<T>) {
        return this.model.create(data);
    }

    async get(filter: QueryFilter<T>) {
        const query =  this.model.findOne (
            this.util.prepareFilter(filter)
        )

        if(this.options.exclusion) {
            query.select(this.options.exclusion);
        }
        return query.exec();
    }

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

    async update( filter: QueryFilter<T>, data: UpdateQuery<T>) {
        return this.model.findOneAndUpdate( filter, data,
            {            
                new: this.options.return_doc ?? true,            
                runValidators: true        
            }    
        ).exec();
    }

    async delete(filter: QueryFilter<T>) {
        return this.model.findOneAndDelete(this.util.prepareFilter(filter)).exec();
    }

    async aggregate<R =any>(
        pipeline: PipelineStage[]
    ): Promise<R[]> {
        return this.model.aggregate<R>(pipeline).exec();
    }

    async deleteMany(
        filter: QueryFilter<T>
    ) {
        return this.model.deleteMany(filter).exec();
    }
}