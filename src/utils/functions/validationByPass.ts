import { getSkipValidation } from '../../models/SkipValidation';

const shouldSkipValidation = async (requestID: string, msisdn: string) => {
	const skipValidation = await getSkipValidation(requestID, msisdn);
	return !!skipValidation;
};

export default shouldSkipValidation;
