const joi = require("joi");
const path = require("path");
require("dotenv").config();

const envVarsSchema = joi
  .object()
  .keys({
    FIREBASE_AUTHDOMAIN: joi.string().required().description("Map api secret"),
    FIREBASE_MEASUREMENTID: joi
      .string()
      .required()
      .description("Map api secret"),
    FIREBASE_API_KEY: joi
      .string()
      .required()
      .description("Firebase api secret"),
    FIREBASE_API_ID: joi.string().required().description("Firebase api secret"),
    FIREBASE_DATABASE: joi
      .string()
      .uri()
      .required()
      .description("Firebase Database endpoint"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
