class ValidationError extends Error {
	statusCode: number;

	constructor(error: any) {
		super(error.message);
		this.name = 'ValidationError';
		this.statusCode = 400;
	}
}

export default ValidationError;
