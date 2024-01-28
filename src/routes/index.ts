import { Router } from 'express';
import { findAllUsers, createUser, addFriend, updateCount, findUser, updateBadges, findItems, createItem, updateItem, findItem } from '../models';

const router: Router = Router();

// Define your routes here
router.get('/', async (req, res) => {
  const users = await findAllUsers();
  console.log(users);
  res.send(users);
});


router.post('/create-user', (req, res) => {
  const receivedData = req.body;
  console.log(receivedData); // Log the received data to the console

  // Handle the data (e.g., save to database)
  createUser(receivedData.name, receivedData.username, receivedData.location);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/test', (req, res) => {
  res.json({ message: 'This is a test response from the backend' });
});

router.patch('/add-friend', (req, res) => {
  const receivedData = req.body;
  console.log('update friend: ', receivedData); // Log the received data to the console

  addFriend(receivedData.id, receivedData.friendId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/update-count', (req, res) => {
  const receivedData = req.body;
  console.log('update countshit: ', receivedData); // Log the received data to the console
  // item needs to be 'recycled' | 'trash' | 'givenAway'
  updateCount(receivedData.id, receivedData.item, receivedData.count);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/user/:username', async (req, res) => {
  const user = await findUser(req.params.username);
  console.log(user);
  res.send(user);
});

router.patch('/update-badges', (req, res) => {
  const receivedData = req.body;
  console.log('update badges: ', receivedData);

  updateBadges(receivedData.id, receivedData.badge);
  res.status(200).json({ message: 'Data received successfully' });
});

router.get('/items', async (req, res) => {
  // taken is a bool
  res.send(await findItems(req.body.taken));
});

router.post('/create-item', (req, res) => {
  const receivedData = req.body;
  console.log('create item', receivedData);

  createItem(receivedData.name, receivedData.imageUrl, receivedData.status, receivedData.count ?? 1, receivedData.userId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/take-item', (req, res) => {
  const receivedData = req.body;
  console.log('take item', receivedData);

  updateItem(receivedData.id, 'taken', receivedData.count, receivedData.userId, receivedData.buyerId);
  res.status(200).json({ message: 'Data received successfully' });
});

router.patch('/update-item', (req, res) => {
  const receivedData = req.body;
  console.log('update item', receivedData);

  updateItem(receivedData.id, receivedData.status, receivedData.userId, receivedData.count, receivedData?.buyerId);
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
