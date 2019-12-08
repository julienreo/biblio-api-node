const appRoot = require("app-root-path");
const winston = require("winston");
const {transports, createLogger, format} = winston;

/**
 * Log only the messages that match a specific level
 *
 * @param {string} level
 */
const filterOnly = (level) => {
  return format((info) => {
    if (info["level"] === level) {
      return info;
    }
  })();
};

const logger = new createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      format: format.combine(format.json(), format.prettyPrint())
    }),
    new transports.File({
      filename: `${appRoot}/storage/logs/error.log`,
      level: "error",
      maxsize: 10485760, // 100MB
      maxFiles: 3,
      handleExceptions: true,
      format: format.combine(filterOnly("error"), format.timestamp(), format.json())
    }),
    new transports.File({
      filename: `${appRoot}/storage/logs/info.log`,
      level: "info",
      maxsize: 10485760, // 10MB
      maxFiles: 3,
      handleExceptions: true,
      format: format.combine(filterOnly("info"), format.timestamp(), format.json())
    })
  ],
  exitOnError: false
});

module.exports = logger;