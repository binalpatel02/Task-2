import Joi from "joi";

export const createProductValidator = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    quantity: Joi.number()
        .integer()
        .min(0)
        .required()

});

export const updateProductValidator = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    price: Joi.number()
        .min(0),

    quantity: Joi.number()
        .integer()
        .min(0)

}).min(1);