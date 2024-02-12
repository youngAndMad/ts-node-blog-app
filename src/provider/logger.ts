import { createLogger, format, transports } from "winston";

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const customTimestamp = () => {
  const now = new Date();
  return `${now.toISOString().slice(0, 19).replace("T", " ")}`;
};

const log = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: customTimestamp }),
    format.colorize(),
    format.printf(
      ({ level, message, timestamp, className }) =>
        `[${timestamp}] ${
          className === undefined ? "app" : className
        } ${level}: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

export const getLogger = (className: string) =>
  log.child({ className: className });

export default log;
