const validateXml = (data: string): any =>
	data.replace(/&/g, '&amp;').replace(/-/g, '&#45;');

export default validateXml;
