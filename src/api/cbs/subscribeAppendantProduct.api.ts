import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';

import { IContext } from '../../interfaces/ILogger.interface';
import { SubscribeAppendantProductResponse } from '../../interfaces/ISubscribeAppendant';
import HttpError from '../../utils/errors/HttpError';
import logger from '../../utils/loggers/logger';

const URL: string = config.get('api.cbs.url');
const USERNAME: string = config.get('api.cbs.username');
const PASSWORD: string = config.get('api.cbs.password');
const SUCCESS_CODE: string = '405000000';

interface ISubscribeProductRequest {
	requestID: string;
	msisdn: string;
	productID: string;
}

const subscribeProductApi = async (input: ISubscribeProductRequest) => {
	const { requestID, msisdn, productID } = input;
	const soapHeader = {
		headers: {
			'Content-Type': 'text/xml',
			SoapAction: 'SubscribeAppendantProduct',
		},
	};

	const context: IContext = {
		user: 'CBS',
		label: 'subscribeAppendantProductApi',
		requestID: requestID,
		request: { msisdn, productID },
	};

	const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bus="http://www.huawei.com/bme/cbsinterface/cbs/businessmgrmsg" xmlns:com="http://www.huawei.com/bme/cbsinterface/common" xmlns:bus1="http://www.huawei.com/bme/cbsinterface/cbs/businessmgr">
         <soapenv:Header/>
         <soapenv:Body>
            <bus:SubscribeAppendantProductRequestMsg>
               <RequestHeader>
                  <com:CommandId>SubscribeAppendantProduct</com:CommandId>
                  <com:Version>1</com:Version>
                  <com:TransactionId>TransID_203948</com:TransactionId>
                  <com:SequenceId>1</com:SequenceId>
                  <com:RequestType>Event</com:RequestType>
                  <com:SessionEntity>
                     <com:Name>${USERNAME}</com:Name>
                     <com:Password>${PASSWORD}</com:Password> 
                     <com:RemoteAddress>10.1.1.22</com:RemoteAddress>
                  </com:SessionEntity>
                  <com:SerialNo>${requestID}</com:SerialNo>
                  <com:Remark>remark_test001</com:Remark>
               </RequestHeader>
               <SubscribeAppendantProductRequest>
                  <bus1:SubscriberNo>${msisdn}</bus1:SubscriberNo>
                  <bus1:Product>
                     <bus1:Id>${productID}</bus1:Id>
                     <bus1:ValidMode>4050000</bus1:ValidMode>
                  </bus1:Product>
               </SubscribeAppendantProductRequest>
            </bus:SubscribeAppendantProductRequestMsg>
         </soapenv:Body>
      </soapenv:Envelope>
   `;

	const soapResponse = await axios.post(URL, soapRequest, soapHeader);
	const jsonResponse: SubscribeAppendantProductResponse = await xml2js.parseStringPromise(
		soapResponse.data
	);

	context.response = { soapResponse: soapResponse.data, jsonResponse };
	const responseData = jsonResponse['soapenv:Envelope']['soapenv:Body'][0];
	const resultCode =
		responseData.SubscribeAppendantProductResultMsg[0].ResultHeader[0].ResultCode[0]._;
	const resultDesc =
		responseData.SubscribeAppendantProductResultMsg[0].ResultHeader[0].ResultDesc[0]._;

	// ! Not successful
	if (resultCode !== SUCCESS_CODE) {
		throw new HttpError(resultDesc, 400, context);
	}

	logger.info(resultDesc, context);
	return true;
};

export default subscribeProductApi;
