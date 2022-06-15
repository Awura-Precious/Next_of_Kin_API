import { Request, Response } from 'express';

import { IContext } from '../interfaces/ILogger.interface';
import asyncHandler from '../middlewares/async.middleware';
import logger from '../utils/loggers/logger';

const test = asyncHandler(async (req: Request, res: Response) => {
	const requestID = res.locals.requestID;

	const context: IContext = {
		user: 'testUser',
		label: 'testLabel',
		message: 'TestMessage',
		requestID: requestID,
		request: req.query,
	};

	logger.info(context);
	logger.warn(context);
	logger.error(context);

	res.status(200).json(context);
});

export default test;
