import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';
import logger from '../utils/loggers/logger';

const HOST = config.get('mfs.getDetails.HOST');
const PORT = config.get('mfs.getDetails.PORT');
const LOGIN_KEY = config.get('mfs.getDetails.LOGIN');
const LOGIN_PASSWORD = config.get('mfs.getDetails.PASSWORD');

const URL = `http://${HOST}:${PORT}/services/gkycProfileManagement?LOGIN=${LOGIN_KEY}&PASSWORD=${LOGIN_PASSWORD}`;

const detailsApi = async (msisdn: string) => {
	const xml = `
  <COMMAND>
    <TYPE>MPRFL</TYPE>
    <MSISDN>${msisdn}</MSISDN>
    <FNAME></FNAME>
    <MIDDLE_NAME></MIDDLE_NAME>
    <LNAME></LNAME>
  </COMMAND>
`;
	try {
		const xmlRes = await axios.post(URL, xml);
		const jsonRes = await xml2js.parseStringPromise(xmlRes.data);
		const status: string = jsonRes?.COMMAND?.TXNSTATUS?.[0];
		const message: string = jsonRes?.COMMAND?.MESSAGE?.[0];
		const firstName: string = jsonRes?.COMMAND?.NXTKINFNAME?.[0];
		const lastName: string = jsonRes?.COMMAND?.NXTKINLNAME?.[0];
		const phoneNumber: string = jsonRes?.COMMAND?.NXTKINCONTACTNUMBER?.[0];

		if (status != '200') {
			logger.warn(message);
			throw new Error(message);
		}

		if (firstName === 'null' || lastName === 'null')
			return `No Details, please update Next of Kin Details`;

		return ` Name: ${firstName} ${lastName}\n Contact Number: 0${phoneNumber}`;
	} catch (error: any) {
		const errorMesage = error.message || 'An error occured';
		throw new Error(errorMesage);
	}
};

export default detailsApi;
