import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import config from './app/config';
import cookieParser from 'cookie-parser';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
// app.use(express.json({ limit: '50mb' }))
// app.use(express.urlencoded({ limit: '50mb' }))

app.use(cors({ origin: [`${config.client_url_link}`], credentials: true }));

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome  To Recipe Sharing Community Server');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
