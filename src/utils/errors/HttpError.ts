import { IContext } from '../../interfaces/ILogger.interface';

class HttpError extends Error {
	statusCode: number;

	context: IContext | null;

	constructor(message: string, statusCode: number | 500, context: IContext | null = null) {
		super(message);

		this.name = 'HttpError';
		this.statusCode = statusCode;
		this.context = context;
	}
}

export default HttpError;
