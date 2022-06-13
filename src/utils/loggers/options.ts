import { format } from 'winston';

import * as logFormatter from './formats';

export const console = {
	level: 'verbose',
	format: format.combine(logFormatter.pretty, format.colorize({ all: true })),
	colorize: true,
};

export const error = {
	level: 'error',
	format: format.combine(logFormatter.error),
	expressFormat: true,
};

export const combined = {
	level: 'http',
	format: logFormatter.json,
};
