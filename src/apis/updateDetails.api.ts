import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';

import logger from '../utils/loggers/logger';

const HOST = config.get('mfs.getDetails.HOST');
const PORT = config.get('mfs.getDetails.PORT');
const LOGIN_KEY = config.get('mfs.getDetails.LOGIN');
const LOGIN_PASSWORD = config.get('mfs.getDetails.PASSWORD');

const URL = `http://${HOST}:${PORT}/services/gkycProfileManagement?LOGIN=${LOGIN_KEY}&PASSWORD=${LOGIN_PASSWORD}`;

interface IUpdate {
	msisdn: string;
	kinFirstName: string;
	kinLastName: string;
	kinMsisdn: string;
	kinDob: string;
	kinIdNumber: string;
}

const updateDetailsApi = async (input: IUpdate) => {
	const { msisdn, kinFirstName, kinLastName, kinMsisdn, kinDob, kinIdNumber } =
		input;

	const xml = `
  <COMMAND>
    <TYPE>MPRFL</TYPE>
    <PROFILECODE></PROFILECODE>
    <MSISDN>${msisdn}</MSISDN>
    <PREFIX></PREFIX>
    <FNAME></FNAME>
    <MIDDLE_NAME></MIDDLE_NAME>
    <LNAME></LNAME>
    <NATIONALITY></NATIONALITY>
    <IDTYPE></IDTYPE>
    <IDNUMBER></IDNUMBER>
    <SOI></SOI>
    <MONTHLYTURNOVER></MONTHLYTURNOVER>
    <ADDRESS></ADDRESS>
    <REGION></REGION>
    <CITY></CITY>
    <COUNTRY></COUNTRY>
    <LOCALITY></LOCALITY>
    <EMAIL></EMAIL>
    <DESIGNATION></DESIGNATION>
    <CPERSON></CPERSON>
    <CNUMBER></CNUMBER>
    <GENDER></GENDER>
    <DOB></DOB>
    <DSRNAME></DSRNAME>
    <DSRMSISDN></DSRMSISDN>
    <PAYMENTTYPEID></PAYMENTTYPEID>
    <POIOID></POIOID>
    <ISSUECOUNTRY></ISSUECOUNTRY>
    <RCOUNTRY></RCOUNTRY>
    <ISSUEDATE></ISSUEDATE>
    <IXPIRYDATE></IXPIRYDATE>
    <POSTALCODE></POSTALCODE>
    <NXTKINFNAME>${kinFirstName}</NXTKINFNAME>
    <NXTKINMIDDLENAME></NXTKINMIDDLENAME>
    <NXTKINLNAME>${kinLastName}</NXTKINLNAME>
    <NXTKINCONTACTNUMBER>${kinMsisdn}</NXTKINCONTACTNUMBER>
    <NXTKINRELATIONSHIP></NXTKINRELATIONSHIP>
    <NXTKINDOB>${kinDob}</NXTKINDOB>
    <NXTKINIDNUMBER>${kinIdNumber}</NXTKINIDNUMBER>
    <NXTKINIDTYPE></NXTKINIDTYPE>
    <NXTKINNATIONALITY></NXTKINNATIONALITY>
</COMMAND>
  `;

	try {
		const xmlRes = await axios.post(URL, xml);
		const jsonRes = await xml2js.parseStringPromise(xmlRes?.data);
		const status = jsonRes?.COMMAND?.TXNSTATUS;
		console.log(status);
		if (status == '01035') {
			logger.warn(`service unavailable`, { msisdn: msisdn });
			throw new Error('Service Unavailable, Please try again later');
		}
		return;
	} catch (error) {
		console.log(error);
		console.log('an error occur');
	}
};

export default updateDetailsApi;
