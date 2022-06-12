import config from 'config';
import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

import { pretty, json } from './formats';
import * as options from './options';

const transports: any = [
	// REMOVE AFTER REVIEW: We replace your file transports with winston-daily-rotate transports
	// REMOVE AFTER REVIEW: new winston.transports.File(options.combined),
	// REMOVE AFTER REVIEW: new winston.transports.File(options.error),
	new winston.transports.DailyRotateFile({
		filename: 'combined.log',
		datePattern: 'YYYY-MM-DD',
		dirname: 'logs/%DATE%',
		...options.combined,
	}),
	new winston.transports.DailyRotateFile({
		filename: 'error.log',
		datePattern: 'YYYY-MM-DD',
		dirname: 'logs/%DATE%',
		...options.error,
	}),
];

// if console logging is enabled
if (config.get('logger.console')) {
	transports.push(
		new winston.transports.Console({
			level: 'verbose',
			format: format.combine(pretty, format.colorize({ all: true })),
		})
	);
}

// Create logger with configurations
const logger = winston.createLogger({
	transports,
	levels: winston.config.npm.levels,
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true })
	),
});

export default logger;
