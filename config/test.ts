import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT || 5000,
	env: process.env.NODE_ENV || 'development',
	logger: {
		console: true,
		dirname: `${process.env.LOG_DIRECTORY || ''}/%DATE%`,
		datePattern: 'YYYYMMDD',
	},
	mfs:{
		getDetails:{
			HOST: process.env.MFS_API_HOST,
			PORT: process.env.MFS_API_PORT,
			LOGIN:process.env.MFS_LOGIN_KEY,
			PASSWORD:process.env.MFS_PASSWORD

		}
	}
};

export default config;
