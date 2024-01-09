import hpp from 'hpp';
import cors from 'cors';
import config from 'config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';
import logger from './utils/loggers/logger';
import errorHandler from './middlewares/errorHandler.middleware';
import { IContext } from './interfaces/ILogger.interface';

const port: number = config.get('port');
const env: string = config.get('env');
const app = express();

app.use(hpp());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.use(errorHandler);

// start express server
app.listen(port, async () => {
	const message = `Server is running in mode: ${env} at http://localhost:${port}`;

	const context: IContext = {
		user: 'ATM NEXT_OF_KIN',
		label: 'Startup',
		requestID: Date.now().toString(),
		request: null,
	};

	logger.verbose(message, context);
});
