import { Router } from 'express';
import { findAllUsers, insertUser } from '../models';

const router: Router = Router();

// Define your routes here
router.get('/', async (req, res) => {
  const users = await findAllUsers();
  console.log(users);
  res.send(users);
});


router.post('/submit-data', (req, res) => {
  const receivedData = req.body;
  console.log(receivedData); // Log the received data to the console

  // Handle the data (e.g., save to database)
  insertUser(receivedData);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'This is a test response from the backend' });
});


export default router;
