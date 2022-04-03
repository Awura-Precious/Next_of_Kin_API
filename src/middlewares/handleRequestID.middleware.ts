import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';

const handleRequestID = async (req: Request, res: Response, next: NextFunction) => {
	req.body.requestID = req.body?.requestID || uuid.v4();
	next();
};

export default handleRequestID;
