import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';

const handleRequestID = async (req: Request, res: Response, next: NextFunction) => {
	res.locals.requestID = uuid.v4();
	next();
};

export default handleRequestID;
