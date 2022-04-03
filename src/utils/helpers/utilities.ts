import * as constants from '../constants/variables';

const getKeyByValue = (obj: any, value: any) => Object.keys(obj).find((key) => obj[key] === value);

export const getAction = (requestTypeID: number): string =>
	getKeyByValue(constants.requestTypes, requestTypeID) || 'UNDEFINED';

export const getService = (path: string): number => {
	switch (path) {
		case '/v1/nonbiometric/registration':
			return constants.serviceTypes.SERVICE_REGISTRATION;
		case '/v1/nonbiometric/reRegistrationBasic':
			return constants.serviceTypes.SERVICE_LINKING;
		case '/v1/nonbiometric/reRegistrationSecurity':
			return constants.serviceTypes.SERVICE_LINKING_SECURITY;
		case '/v1/nonbiometric/registrationMfs':
			return constants.serviceTypes.SERVICE_REGISTRATION;
		case '/v1/passport/registration':
			return constants.serviceTypes.SERVICE_REGISTRATION;
		case '/v1/passport/reRegistration':
			return constants.serviceTypes.SERVICE_LINKING;
		case '/v1/subscriber/check-kyc-status':
			return constants.serviceTypes.SERVICE_CHECK_STATUS;
		default:
			return constants.serviceTypes.UNDEFINED;
	}
};

export const loadSubscriberKYC = (data: any) => ({
	suuid: data.SUUID,
	docType: data.DOC_TYPE || constants.documentTypes.NATIONAL_ID,
	docNumber: data.NATIONALID,
	forenames: data.FORENAMES,
	surname: data.SURNAME,
	nationality: data.NATIONALITY,
	dateOfBirth: data.BIRTHDATE,
	gender: data.GENDER,
	district: data.DIG_DISTRICT,
	address: data.DIGITALADDRESS,
	region: data.DIG_REGION,
});

export const getPaymentMode = (paidMode: string) => {
	switch (paidMode) {
		case '0':
			return 'PREPAID';
		case '1':
			return 'POSTPAID';
		case '2':
			return 'HYBRID';
		default:
			return 'PREPAID';
	}
};

export const getDocumentType = (docType: number) => {
	switch (docType) {
		case 1:
			return 'NATIONAL ID';
		case 2:
			return 'PASSPORT';
		default:
			return 'UNDEFINED';
	}
};

export const formatNationalID = (nationalID: string): string => {
	// if the length is equal to 13: GHA1234567890
	if (nationalID.length === 13) {
		const head = nationalID.slice(0, 3);
		const middle = nationalID.slice(3, 12);
		const end = nationalID.slice(12, 13);

		nationalID = `${head}-${middle}-${end}`;
	}

	if (nationalID.length === 12) {
		const head = nationalID.slice(0, 3);
		const middle = nationalID.slice(3, 11);
		const end = nationalID.slice(11, 12);

		nationalID = `${head}-${middle}-${end}`;
	}

	return nationalID;
};
