import { IContext } from '../../interfaces/ILogger.interface';
import messages from '../../messages/db.messages';

class DbError extends Error {
	statusCode: number;

	context: IContext;

	constructor(message: string, context: IContext) {
		super(message || messages.GENERAL_DB_ERROR);

		this.name = 'DbError';
		this.context = context;
		this.statusCode = 500;
	}
}

export default DbError;
