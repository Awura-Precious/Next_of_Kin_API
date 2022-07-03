import axios from 'axios';
import config from 'config';

import { IContext } from '../../interfaces/Logger.interface';
import logger from '../loggers/logger';

const HOST = config.get('api.sms.url');
const PORT = config.get('api.sms.port');
const USERNAME = config.get('api.sms.username');
const PASSWORD = config.get('api.sms.password');

interface SmsInterface {
	requestID: string;
	msisdn: string;
	text: string;
}

const sendSms = async (request: SmsInterface) => {
	const { requestID, msisdn, text } = request;

	const context: IContext = {
		user: 'SMS',
		label: 'SendSmsAPI',
		requestID: requestID,
		request: { msisdn, text },
	};

	if (Number.isNaN(msisdn)) return null;
	const url = `http://${HOST}:${PORT}/send?username=${USERNAME}&password=${PASSWORD}&to=233${msisdn}&content=${text}`;

	try {
		const response = await axios.post(url);
		context.response = response.data;
		logger.info(`[${msisdn}]-[${text}]`, context);

		return response.data;
	} catch (error: any) {
		context.error = { ...error };

		if (error.response) {
			context.error = { ...error.response.data };
			logger.warn(`[${msisdn}]-[${text}]`, context);
			return error.response.data;
		}

		logger.error(error, context);
		return null;
	}
};

export default sendSms;
