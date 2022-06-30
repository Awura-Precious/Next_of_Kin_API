/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const errorHandler = (
	error: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => res.send(error.message);

export default errorHandler;
