import Joi from "joi";

export const createOrderItemValidator = Joi.object({
    order_id: Joi.string()
        .required(),

    product_id: Joi.string()
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),

    unit_price: Joi.number()
        .min(0)
        .optional(),

    subtotal: Joi.number()
        .min(0)
        .optional()
});

export const updateOrderItemValidator = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1),

    unit_price: Joi.number()
        .min(0)
}).min(1);