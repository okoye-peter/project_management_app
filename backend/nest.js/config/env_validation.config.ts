import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'staging'),
  PORT: Joi.number().port().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),

  AUTO_LOAD_ENTITIES: Joi.boolean().default(true),

  JWT_SECRET_KEY: Joi.string().required(),
  JWT_TOKEN_DURATION: Joi.number().required(),
});
