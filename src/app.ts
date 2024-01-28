import express, { Express } from 'express';
import routes from './routes';
import { runDB } from './db';
import cors from 'cors'

const app: Express = express();
app.use(cors({
  origin: '*'
}));
runDB().then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
})

app.use(express.json());
app.use(routes);

export default app;
