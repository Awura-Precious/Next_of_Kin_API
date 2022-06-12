import { format } from 'winston';

import * as logFormatter from './formats';

export const console = {
	level: 'verbose',
	// REMOVE AFTER REVIEW: Since we are using winston-daily-rotate-file, we don't specify file name
	// REMOVE AFTER REVIEW: filename: path.join(directory, 'logs', currentDay, 'verbose.log'),
	format: format.combine(logFormatter.pretty, format.colorize({ all: true })),
	colorize: true,
};

export const error = {
	level: 'error',
	// REMOVE AFTER REVIEW: filename: path.join(directory, 'logs', currentDay, 'error.log'),
	format: format.combine(logFormatter.error),
	expressFormat: true,
};

export const combined = {
	level: 'http',
	format: logFormatter.json,
	// REMOVE AFTER REVIEW: filename: path.join(directory, 'logs', currentDay, 'combined.log'),
};
