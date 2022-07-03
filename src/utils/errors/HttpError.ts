import { IContext } from '../../interfaces/Logger.interface';

class HttpError extends Error {
	statusCode: number;

	context: IContext | null;

	constructor(
		message: string,
		statusCode: number,
		context: IContext | null = null,
	) {
		super(message);
		this.name = 'HttpError';
		this.statusCode = statusCode || 500;
		this.context = context;
	}
}

export default HttpError;
