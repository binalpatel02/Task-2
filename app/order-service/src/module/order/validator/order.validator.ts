import Joi from "joi";

export const createOrderValidator = Joi.object({
    user_id: Joi.string()
        .required(),

    total_amount: Joi.number()
        .min(0)
        .optional(),

    order_status: Joi.string()
        .valid(
            "PENDING",
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED"
        )
        .default("PENDING")
});

export const updateOrderValidator = Joi.object({
    total_amount: Joi.number()
        .min(0),

    order_status: Joi.string()
        .valid(
            "PENDING",
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED"
        )
}).min(1);