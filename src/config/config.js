import * as dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.HTTP_PORT ? process.env.HTTP_PORT : 8080,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PERSISTENCE: process.env.PERSISTENCE,
  ADMIN_ROLE: "admin",
  USER_ROLE: "user",
  PREMIUM_ROLE: "premium",
  EMAIL_APP: process.env.EMAIL_APP,
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  EMAIL_APP_PORT: process.env.EMAIL_APP_PORT,
  EMAIL_APP_SERVICE: process.env.EMAIL_APP_SERVICE,
  MODE: process.env.MODE,
  LOG_FILE: "./errors.log",
  MAX_MINUTES_TO_EXPIRE: 60,
  MAX_USER_IDLE_TIME: process.env.MAX_USER_IDLE_TIME_IN_MIN,
  DOC_NAMES: ["IDENTIFICACION", "DOMICILIO", "ESTADO"],
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  STRIPE_PUBLIC_API_KEY: process.env.STRIPE_PUBLIC_API_KEY,
  DOLLAR_EXCHANGE_RATE: process.env.DOLLAR_EXCHANGE_RATE,
};

export default config;
