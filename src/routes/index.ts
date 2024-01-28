import { Router } from 'express';
import { findAllUsers, createUser, addFriend, updateCount, findUser, updateBadges, findItems, createItem, updateItem, findItem } from '../models';

const router: Router = Router();

// Define your routes here
router.get('/', async (req, res) => {
  const users = await findAllUsers();
  res.send(users);
});


router.post('/create-user', (req, res) => {
  const receivedData = req.body;

  // Handle the data (e.g., save to database)
  createUser(receivedData.email, receivedData.username, receivedData.location);
  res.status(200).json({ message: 'Data received successfully' });
});

router.post('/login', async (req, res) => {
  const receivedData = req.body;
  
  const user = await findUser(receivedData.email);
  res.send(user);
});

router.get('/test', (req, res) => {
  res.json({ message: 'This is a test response from the backend' });
});

router.patch('/add-friend', (req, res) => {
  const receivedData = req.body;

  addFriend(receivedData.id, receivedData.friendId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/update-count', (req, res) => {
  const receivedData = req.body;
  // item needs to be 'recycled' | 'trash' | 'givenAway'
  updateCount(receivedData.id, receivedData.item, receivedData.count);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/user/:username', async (req, res) => {
  const user = await findUser(req.params.username);
  res.send(user);
});

router.patch('/update-badges', (req, res) => {
  const receivedData = req.body;

  updateBadges(receivedData.id, receivedData.badge);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/items', async (req, res) => {
  // taken is a bool
  res.send(await findItems(req.body.taken));
});

router.post('/create-item', (req, res) => {
  const receivedData = req.body;

  createItem(receivedData.name, receivedData.imageUrl, receivedData.status, receivedData.count ?? 1, receivedData.userId, receivedData.description, receivedData.tags);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/take-item', (req, res) => {
  const receivedData = req.body;

  updateItem(receivedData.id, 'taken', receivedData.count, receivedData.userId, receivedData.buyerId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/update-item/:id', (req, res) => {
  const receivedData = req.body;

  updateItem(req.params.id, receivedData.status, receivedData.userId, receivedData.count, receivedData?.buyerId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/item/:id', async (req, res) => {
  res.send(await findItem(req.params.id));
});

router.get('/leaderboard', async (req, res) => {
  const users = await findAllUsers();
  const sortedUsers = users.sort((a, b) => (a.points < b.points) ? 1 : -1);
  res.send(sortedUsers);
});

export default router;
