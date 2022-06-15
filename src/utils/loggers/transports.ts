import config from 'config';
import winston from 'winston';
import 'winston-daily-rotate-file';

import * as logFormatter from './formats';

const datePattern = config.get('logger.datePattern') as string;
const dirname = config.get('logger.dirname') as string;

const transports: Array<any> = [
	new winston.transports.DailyRotateFile({
		level: 'info',
		filename: 'combined.log',
		datePattern,
		dirname,
		format: winston.format.combine(logFormatter.json),
	}),
	new winston.transports.DailyRotateFile({
		dirname,
		filename: 'error.log',
		datePattern,
		level: 'error',
		format: winston.format.combine(logFormatter.error),
	}),
];

// if console logging is enabled
if (config.get('logger.console')) {
	transports.push(
		new winston.transports.Console({
			level: 'verbose',
			format: winston.format.combine(logFormatter.pretty, winston.format.colorize({ all: true })),
		})
	);
}

export default transports;
