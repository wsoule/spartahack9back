import express, { Express } from 'express';
import { getAuth } from 'firebase-admin/auth';
import routes from './routes';
import cors from 'cors'
import { getDB } from './db';

const app: Express = express();
const auth = getAuth();

app.use(cors({
  origin: '*'
}));
getDB();
app.use(express.json());
app.use(routes);

// Get User ID Token
app.post('/login', async (req, res) => {
  const firebaseUid = req.body.uid;

auth.verifyIdToken(firebaseUid)
  .then((decodedToken) => {
      
      // Find or create a user in MongoDB
      User.findOneAndUpdate({ firebaseUid: decodedToken.uid }, {
        // Update additional fields if needed
      }, { new: true, upsert: true })
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(401).json({ message: "Invalid token" }));
});

export default app;