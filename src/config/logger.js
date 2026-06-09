require('winston-mongodb')
const winston = require('winston')

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
    new winston.transports.MongoDB({
      db: process.env.DB,
      level: "error",
    }),
  ],
});

// Ctach unhandled synchronous errors that weren't cought in try-catch blocks
process.on("uncaughtException", (err) => {
  logger.error("Uncught Ecxeption", err);
  logger.on("finish", () => {
    process.exit(1);
  });
  logger.end();
});

// Catch unhandled promise rejection
process.on("unhandledRejaction", (err) => {
  logger.error("Unhandled Promise Rejection", err);
  logger.on("finish", () => {
    process.exit(1);
  });
  logger.end();
});

module.exports = logger
