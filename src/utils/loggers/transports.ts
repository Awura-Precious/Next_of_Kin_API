import config from 'config';
import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

import { pretty } from './formats';
import * as options from './options';

const datePattern = config.get('logger.datePattern') as string;
const dirname = config.get('logger.dirname') as string;

const transports: any = [
	new winston.transports.DailyRotateFile({
		filename: 'combined.log',
		datePattern,
		dirname,
		...options.combined,
	}),
	new winston.transports.DailyRotateFile({
		filename: 'error.log',
		datePattern,
		dirname,
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

export default transports;
