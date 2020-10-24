import startServer from '@lib/server';
import error from '@middleware/error';
import router from '@routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();

// Enable CORS
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

// JSON body parser
app.use(bodyParser.json());

// Routes handlers
app.use('/', router);

// 404 and 500 errors handler
app.use([error.notFound, error.server]);

export const server = startServer(app);
