import messages from '../messages/db.messages';

class DBError extends Error {
	statusCode: number;

	system: string;

	constructor(message: string, system: string | null) {
		super(message || messages.GENERAL_DB_ERROR);
		this.system = system || 'BIOSIMREG';
		this.name = this.constructor.name;
		this.statusCode = 500;
	}
}

export default DBError;
