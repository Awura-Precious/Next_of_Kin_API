import { Request } from 'express';
import morgan from 'morgan';
import json from 'morgan-json';

import logger from '../utils/loggers/logger';

// @ts-ignore
morgan.token('id', (req: Request) => req.body.requestID);

// @ts-ignore
morgan.token('data', (req: Request) => {
	const data = {
		body: req.body,
		params: req.params,
		query: req.query,
	};

	return JSON.stringify(data);
});

const format = json({
	method: ':method',
	url: ':url',
	status: ':status',
	contentLength: ':res[content-length]',
	responseTime: ':response-time',
	data: ':data',
	id: ':id',
});

const httpLogger = morgan(format, {
	stream: {
		write: (message) => {
			const { data, method, url, status, contentLength, responseTime } = JSON.parse(message);
			const request = JSON.parse(data);

			const context = {
				requestID: request?.body.requestID,
				user: 'HttpLogger',
				label: 'HttpLoggerMiddleware',
				http: {
					method,
					url,
					status: Number(status),
					contentLength,
					responseTime: Number(responseTime),
					data: JSON.parse(data),
				},
			};

			logger.http('HTTP Log', { context });
		},
	},
});

export default httpLogger;
