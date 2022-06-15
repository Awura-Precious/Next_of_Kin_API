import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT || 5000,
	env: process.env.NODE_ENV || 'development',
	logger: {
		console: true,
		dirname: `${process.env.LOG_DIRECTORY}logs/%DATE%`,
		datePattern: 'YYYYMMDD',
	},
};

export default config;
