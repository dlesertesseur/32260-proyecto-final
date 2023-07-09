import winston from "winston";
import config from "../config/config.js";

let logger;

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "yellow redBG",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const buildProdLogger = () => {
  const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "error",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevels.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: config.LOG_FILE, level: "error" }),
    ],
  });
  return logger;
};

const buildDevLogger = () => {
  const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevels.colors }),
          winston.format.simple()
        ),
      })
    ],
  });
  return logger;
};

if (config.MODE === "production") {
  logger = buildProdLogger();
} else {
  logger = buildDevLogger();
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

export {logger}