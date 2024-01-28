import express, { Express } from 'express';
import routes from './routes';
import cors from 'cors'
import { getDB } from './db';

const app: Express = express();

app.use(cors({
  origin: '*'
}));
getDB();
app.use(express.json());
app.use(routes);

export default app;