import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT,
	env: process.env.NODE_ENV,
	logger: {
		console: true,
		path: '',
	},
};

export default config;
