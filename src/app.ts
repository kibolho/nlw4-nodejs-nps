import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import createConnection from './database';
import { router } from './router';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  response.setHeader('Content-Type', 'text/html')
  response.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  next();
});
app.use(router);
app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'Error',
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'Error',
      message: `Internal server error ${err.message}`,
    });
  },
);

export { app };
