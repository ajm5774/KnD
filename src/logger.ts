const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, label } = format;

const myFormat = printf((info: any) => {
  return `[${info.timestamp}][${info.level}] - ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(), // Add timestamp to the format info, so we can use it in myFormat.
    myFormat,
  ),
  transports: [new transports.Console()]
});

export default logger;
