import { IContext } from '../../interfaces/Logger.interface';
import Messages from '../../messages/app.messages';

class GenericError extends Error {
	statusCode: number;

	context: IContext;

	constructor(context: IContext) {
		super(Messages.TECHNICAL_ISSUE);
		this.name = 'GenericError';
		this.context = context;
		this.statusCode = 500;
	}
}

export default GenericError;
