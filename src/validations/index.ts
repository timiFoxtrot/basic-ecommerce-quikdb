import { celebrate, Joi, Segments } from "celebrate";

export const createUserSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().required().trim(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  {
    abortEarly: false,
  }
);

export const createProductSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().trim(),
      description: Joi.string(),
      price: Joi.string().required(),
    }),
  },
  {
    abortEarly: false,
  }
);
