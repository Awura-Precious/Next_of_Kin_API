export interface IContext {
	user: string;
	label: string;
	requestID: string;
	message?: string;
	request: object | null;
	response?: object | null;
	error?: object;
}
