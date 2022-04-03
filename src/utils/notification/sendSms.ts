import logger from '../loggers/logger';

const SMS = async (requestID: any, msisdn: string, text: string) => {
	const context = {
		user: 'SMS',
		label: 'Send',
		requestID,
		request: {
			cbs: {},
			data: { msisdn, text },
		},
		response: {
			data: {},
			error: null,
		},
	};

	logger.info(`Sending SMS: ${text}`, { context });
};

export default SMS;
