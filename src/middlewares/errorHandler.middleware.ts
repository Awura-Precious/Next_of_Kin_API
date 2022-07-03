/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import { IContext } from '../interfaces/ILogger.interface';
import appMessages from '../messages/app.messages';
import DbError from '../utils/errors/DbError';
import GenericError from '../utils/errors/GenericError';
import HttpError from '../utils/errors/HttpError';
import ValidationError from '../utils/errors/ValidationError';
import logger from '../utils/loggers/logger';

const errorMiddleware = async (
	error: any,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const context: IContext = {
		user: error?.context?.user || 'Error',
		label: error?.context?.label || 'ErrorHandler',
		requestID: error?.context?.requestID,
		request: error?.context?.request || req.body,
		response: error?.context?.response,
		error,
	};

	const response = {
		timestamp: moment(),
		transactionID: res.locals.requestID,
		message: error.message,
	};

	if (error instanceof HttpError || error instanceof ValidationError) {
		logger.warn(error.message, context);
		return res.status(error.statusCode).json(response);
	}

	if (error instanceof GenericError || error instanceof DbError) {
		logger.error(error.message, context);
		return res.status(error.statusCode).json(response);
	}

	// ! Uncaught Error!
	context.error = { ...error, stack: error.stack };
	response.message = appMessages.GENERIC_ERROR;

	logger.error(response.message, context);
	return res.status(error.statusCode || 500).json(response);
};

export default errorMiddleware;
