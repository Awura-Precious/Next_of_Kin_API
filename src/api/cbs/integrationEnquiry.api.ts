import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';

import { IntegrationEnquiryResponse } from '../../interfaces/IIntegrationEnquiry';
import { IContext } from '../../interfaces/ILogger.interface';
import HttpError from '../../utils/errors/HttpError';
import logger from '../../utils/loggers/logger';

const URL: string = config.get('api.cbs.url');
const USERNAME: string = config.get('api.cbs.username');
const PASSWORD: string = config.get('api.cbs.password');
const SUCCESS_CODE: string = '405000000';

interface IIntegrationEnquiryRequest {
	requestID: string;
	msisdn: string;
}

const integrationEnquiry = async (data: IIntegrationEnquiryRequest) => {
	const { requestID, msisdn } = data;
	const headerConfig = {
		headers: {
			'Content-Type': 'text/xml',
			SoapAction: 'IntegrationEnquiry',
		},
	};

	const context: IContext = {
		user: 'CBS',
		label: 'integrationEnquiryAPI',
		requestID: requestID,
		request: { msisdn },
		response: null,
	};

	// sample request
	const soapRequest = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bus="http://www.huawei.com/bme/cbsinterface/cbs/businessmgrmsg" xmlns:com="http://www.huawei.com/bme/cbsinterface/common" xmlns:bus1="http://www.huawei.com/bme/cbsinterface/cbs/businessmgr">
		<soapenv:Header/>
		<soapenv:Body>
				<bus:IntegrationEnquiryRequestMsg>
					<RequestHeader>
							<com:CommandId>IntegrationEnquiry</com:CommandId>
							<com:Version>1</com:Version>
							<com:TransactionId></com:TransactionId>
							<com:SequenceId>1</com:SequenceId>
							<com:RequestType>Event</com:RequestType>
							<com:SessionEntity>
								<com:Name>${USERNAME}</com:Name>
								<com:Password>${PASSWORD}</com:Password>
								<com:RemoteAddress></com:RemoteAddress>
							</com:SessionEntity>
							<com:SerialNo>${requestID}</com:SerialNo>
					</RequestHeader>
					<IntegrationEnquiryRequest>
							<bus1:SubscriberNo>${msisdn}</bus1:SubscriberNo>
							<bus1:QueryType>0</bus1:QueryType>
					</IntegrationEnquiryRequest>
					</bus:IntegrationEnquiryRequestMsg>
			</soapenv:Body>
		</soapenv:Envelope>
	`;

	const soapResponseRaw = await axios.post(URL, soapRequest, headerConfig);
	const jsonResponse: IntegrationEnquiryResponse = await xml2js.parseStringPromise(
		soapResponseRaw.data
	);
	const faultResponse = jsonResponse['soapenv:Envelope']['soapenv:Body'][0];
	context.response = { rawResponse: soapResponseRaw.data, jsonResponse };

	// ! fault response
	if (faultResponse['soapenv:Fault']) {
		const faultMessage = faultResponse['soapenv:Fault'][0].faultstring[0];
		throw new HttpError(faultMessage, 500, context);
	}

	// success response
	const soapBody = jsonResponse['soapenv:Envelope']['soapenv:Body'];
	const integrationEnquiryResultMsg = soapBody[0].IntegrationEnquiryResultMsg[0];
	const resultCode: string = integrationEnquiryResultMsg.ResultHeader[0].ResultCode[0]._;
	const resultDesc: string = integrationEnquiryResultMsg.ResultHeader[0].ResultDesc[0]._;
	context.response = { rawResponse: soapResponseRaw.data, resultCode, resultDesc };

	// ! Not a success result Code, throw error
	if (resultCode !== SUCCESS_CODE) {
		throw new HttpError(resultDesc, 400, context);
	}

	// * CBS information
	const cbsInfo = {
		CumulativeItemList:
			soapBody[0].IntegrationEnquiryResultMsg[0].IntegrationEnquiryResult[0].CumulativeItemList[0],
		BalanceRecordList:
			soapBody[0].IntegrationEnquiryResultMsg[0].IntegrationEnquiryResult[0].BalanceRecordList[0],
		PaidMode:
			soapBody[0].IntegrationEnquiryResultMsg[0].IntegrationEnquiryResult[0].SubscriberInfo[0]
				.Subscriber[0].PaidMode[0],
		FirstActiveDate:
			soapBody[0].IntegrationEnquiryResultMsg[0].IntegrationEnquiryResult[0].SubscriberState[0]
				.FirstActiveDate[0],
		LifeCycleState:
			soapBody[0].IntegrationEnquiryResultMsg[0].IntegrationEnquiryResult[0].SubscriberState[0]
				.LifeCycleState[0],
	};

	context.response = { rawResponse: soapResponseRaw.data, resultCode, resultDesc, cbsInfo };
	logger.info(resultDesc, context);

	return cbsInfo;
};

export default integrationEnquiry;
