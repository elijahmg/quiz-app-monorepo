import { json, urlencoded } from 'body-parser';
import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

export const createServer = (): Express => {
  const app = express();

  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())

  app.get('/message/:name', (req, res) => {
    return res.json({ message: `hello ${req.params.name}` });
  })

  app.get('/status', async (_, res) => {
    return res.json({message: 'hello'});
  });

  return app;
};
