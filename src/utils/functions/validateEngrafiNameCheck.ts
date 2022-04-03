import stringSimilarity from 'string-similarity';

import * as Engrafi from '../../core/Engrafi.system';
import HttpError from '../errors/HttpError';
import engrafiMessages from '../messages/engrafi.messages';
import { SimRegRequest } from '../../interfaces/SimReg.interface';
import { systems } from '../constants/variables';

const validateEngrafiNameCheck = async (simRegRequest: SimRegRequest) => {
	const requestFullName =
		`${simRegRequest.subscriber?.forenames} ${simRegRequest.subscriber?.surname}`.toLowerCase();

	// validate details
	const customerDetails = await Engrafi.getDetails(simRegRequest);
	const customerFullName = `${customerDetails.firstName} ${customerDetails.lastName}`.toLowerCase();

	// ? Perform name similarity check
	const similarity = stringSimilarity.compareTwoStrings(requestFullName, customerFullName);
	const similarityInPercentage = similarity * 100;

	if (similarityInPercentage < 50) {
		throw new HttpError(engrafiMessages.INVALID_DETAILS, 400, systems.ENGRAFI);
	}

	return customerDetails;
};

export default validateEngrafiNameCheck;
