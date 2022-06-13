import logger from '../loggers/logger';

interface IRequest {
	requestID: string;
	msisdn: string;
	text: string;
}

const SMS = async (data: IRequest) => {
	const { requestID, msisdn, text } = data;

	return data;
};

export default SMS;
