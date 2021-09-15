import express from 'express';
import PersonRouter from './routes/Person/person.router';
import { errorMiddleware } from './lib/middleware/error-middleware';

const routes = (app: express.Application) => {
  app.use('/api/person', PersonRouter);
  app.get('/', (req: express.Request, res: express.Response) => {
    return res.status(200).send('Rate Limiter API');
  });

  app.use(errorMiddleware);
};

export default routes;
