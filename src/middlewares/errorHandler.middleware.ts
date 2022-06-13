import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error: any, req: Request, res: Response, _: NextFunction) =>
	res.send(error.message);

export default errorHandler;
