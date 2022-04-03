import * as customerDB from '../../models/Customers';
import HttpError from '../errors/HttpError';
import messages from '../messages/nationalId.messages';
import { ICbs } from '../../interfaces/Cbs.interface';
import { SecurityLinkInput } from '../../validations/nationalId.schema';
import { getLastRecord } from '../../models/ServiceLinking';
import { systems } from '../constants/variables';

const validateSecurityQuestions = async (input: SecurityLinkInput, cbs: ICbs) => {
	const requestID = input.requestID;

	const lastLinkingRequest = await getLastRecord(requestID, input.msisdn);
	if (!lastLinkingRequest) {
		throw new HttpError(messages.NO_LINKING_REQUEST, 400, systems.BIOSIMREG);
	}

	const lastRechargeAndFDNsResult = await customerDB.getRechargeAmountAndFDNs(
		requestID,
		input.msisdn
	);
	const lastRechargeRow = lastRechargeAndFDNsResult[0];
	const frequentlyDialedNumbersRow = lastRechargeAndFDNsResult[1];

	let failCounter = 0;

	// validate last recharge amount
	if (lastRechargeRow) {
		if (input.lastRechargeAmount !== lastRechargeRow.LAST_RECHARGE_AMOUNT) {
			failCounter += 1;
		}
	}

	// validate frequently Dailed Numbers
	let fdnExpected: Array<string> = [];
	if (frequentlyDialedNumbersRow) {
		fdnExpected = [
			frequentlyDialedNumbersRow.Msisdn_1,
			frequentlyDialedNumbersRow.Msisdn_2,
			frequentlyDialedNumbersRow.Msisdn_3,
			frequentlyDialedNumbersRow.Msisdn_4,
			frequentlyDialedNumbersRow.Msisdn_5,
			frequentlyDialedNumbersRow.Msisdn_6,
			frequentlyDialedNumbersRow.Msisdn_7,
			frequentlyDialedNumbersRow.Msisdn_8,
			frequentlyDialedNumbersRow.Msisdn_9,
			frequentlyDialedNumbersRow.Msisdn_10,
		];

		if (!fdnExpected.includes(input.fdn1) && !fdnExpected.includes(input.fdn2)) {
			failCounter += 1;
		}
	}

	// validate activation year
	if (input.activationYear !== cbs.activationYear) {
		failCounter += 1;
	}

	// TODO: validate MFS Balance

	// ! if failCounter is greater than 2, fail request
	if (failCounter >= 3) {
		throw new HttpError(messages.FAILED_SECURITY, 400, systems.BIOSIMREG);
	}

	const securityResult = {
		lastRechargeAmount: lastRechargeRow.LAST_RECHARGE_AMOUNT,
		frequentlyDialedNumbers: fdnExpected,
		mfsBalance: '0',
		activationYear: cbs.activationYear,
	};

	return { lastLinkingRequest, securityResult };
};

export default validateSecurityQuestions;
