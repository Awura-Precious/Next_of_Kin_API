import { format } from 'winston';

// For console logs
export const pretty = format.printf((log: any): string => {
	const { timestamp, level, message, requestID } = log;
	return `[${timestamp}] [${level.toUpperCase()}] [${requestID}]: ${message}`;
});

// For functional logs
export const json = format.printf((log: any): string => {
	const schema: any = {
		timestamp: log.timestamp,
		level: log.level,
		message: log.message,
		context: {
			requestID: log?.requestID,
			user: log?.user,
			label: log?.label,
			request: log?.request,
			response: log?.response,
		},
	};

	return JSON.stringify(schema);
});

// For error logs
export const error = format.printf((log: any): string => {
	const schema: any = {
		timestamp: log.timestamp,
		message: log.message,
		level: log.level,
		context: {
			user: log?.user,
			requestID: log?.requestID,
			label: log?.label,
			request: log?.request,
			response: log?.response,
			error: {
				message: log?.error?.message,
				name: log?.error?.name,
				statusCode: log?.error?.statusCode,
				data: log?.error?.response?.data,
				stack: log?.error?.stack,
			},
		},
	};

	return JSON.stringify(schema);
});
