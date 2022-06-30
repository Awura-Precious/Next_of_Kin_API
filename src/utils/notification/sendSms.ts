interface IRequest {
	requestID: string;
	msisdn: string;
	text: string;
}

const SMS = async (data: IRequest) => {
	return data;
};

export default SMS;
