import Joi from "joi";

export const createErrorValidator = Joi.object({
    method: Joi.string()
        .required(),

    url: Joi.string()
        .required(),

    header: Joi.object()
        .optional(),

    extra: Joi.object()
        .optional(),

    data: Joi.object()
        .optional()
});