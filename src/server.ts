import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import routes from './routes';
import logger from './utils/loggers/logger';
import requestID from './middlewares/requestID.middleware';
import errorHandler from './middlewares/errorHandler.middleware';

const port: number = config.get('port');
const env: string = config.get('env');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(hpp());
app.use('/api/v1', routes);
app.use(requestID);
app.use(errorHandler);

// start express server
app.listen(port, async () => {
	const message = `Server is running in mode: ${env} at http://localhost:${port}`;
	logger.verbose(message);
});
