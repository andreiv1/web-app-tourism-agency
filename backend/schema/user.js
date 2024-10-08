const Joi = require("joi");

const extendedJoi = Joi.extend(require("joi-phone-number"));

const userRegisterSchema = extendedJoi.object({
  birthDate: Joi.date(),
  email: Joi.string().email().optional(),
  phoneNumber: extendedJoi
    .string()
    .phoneNumber({
      format: "international",
      strict: true,
    })
    .required(),
  firstName: Joi.string()
    .min(3)
      .regex(/^[\p{L}]{3,}$/u)
    .required(),
  lastName: Joi.string()
    .min(3)
      .regex(/^[\p{L}]{3,}$/u)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9@#%]{5,30}$/)
    .required(),
  gender: Joi.string().valid("M", "F").required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  password: Joi.string().required(),
}).xor("email", "phoneNumber");

const userRegisterCheckSchema = extendedJoi.object({
  email: Joi.string().email().optional(),
  phoneNumber: extendedJoi
    .string()
    .phoneNumber({
      format: "international",
      strict: true,
    })
    .optional(),
}).xor("email", "phoneNumber");

const userProfileUpdateSchema = extendedJoi.object({
    email: Joi.string().email().optional(),
    phoneNumber: extendedJoi
      .string()
      .phoneNumber({
        format: "international",
        strict: true,
      })
      .optional(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9@#%]{5,30}$/)
        .optional()
}).or("email", "phoneNumber", "password").required()


const addUserSchema = extendedJoi.object({
    birthDate: Joi.date().required(),
    email: Joi.string().email().optional(),
    phoneNumber: extendedJoi
        .string()
        .phoneNumber({
            format: "international",
            strict: true,
        })
        .required(),
    firstName: Joi.string()
        .min(3)
        .regex(/^[\p{L}]{3,}$/u)
        .required(),
    lastName: Joi.string()
        .min(3)
        .regex(/^[\p{L}]{3,}$/u)
        .required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9@#%]{5,30}$/)
        .required(),
    gender: Joi.string().valid("M", "F").required(),
    type: Joi.string().valid("tourist", "admin").required()
})

const updateUserSchema = extendedJoi.object({
    birthDate: Joi.date().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: extendedJoi
        .string()
        .phoneNumber({
            format: "international",
            strict: true,
        })
        .optional(),
    firstName: Joi.string()
        .min(3)
        .regex(/^[\p{L}]{3,}$/u)
        .optional(),
    lastName: Joi.string()
        .min(3)
        .regex(/^[\p{L}]{3,}$/u)
        .optional(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9@#%]{5,30}$/)
        .optional(),
    gender: Joi.string().valid("M", "F").optional(),
    type: Joi.string().valid("tourist", "admin").optional()
})

module.exports = { userRegisterSchema, userRegisterCheckSchema, userLoginSchema, userProfileUpdateSchema,
    addUserSchema,
    updateUserSchema };
