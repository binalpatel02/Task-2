import Joi from "joi";

export const createUserValidator = Joi.object({

  first_name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  last_name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  mobile_number: Joi.string()
    .trim()
    .min(6)
    .max(15)
    .pattern(/^[0-9]+$/)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .required(),

  password: Joi.string()
    .trim()
    .required()
    .min(6),

});

// login
export const loginValidator = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});