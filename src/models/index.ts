import mongoose from 'mongoose';
import { getDB } from '../db';
import { count } from 'console';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  recycled: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  trash: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String 
  }],
  takenItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  location: {
    type: String
  },
  givenItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  selling: {
    type: Number,
    default: 0
  },
  sellingItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'trash'
  },
  image: {
    type: String
  }
});

export const User = mongoose.model('User', userSchema);
export const Item = mongoose.model('Item', itemSchema);

export const findAllUsers = async () => {
  const db = getDB();
  return await db.collection('users').find({}).toArray();
};

export const findUser = async (username: string) => {
  return await User.find({ username: username }).populate('friends').populate('takenItems').populate('givenItems').populate('sellingItems').populate('items');
};

export const createUser = async (email: string, username: string, location: string) => {

  const newUser = new User({ email, username, location });
  return await newUser.save();
}

export const addFriend = async (id: string, friendId: string) => {
  try {
  const user = await User.findByIdAndUpdate(id, { $addToSet: { friends: friendId} });
  await User.findByIdAndUpdate(friendId, { $addToSet: { friends: id} });
  } catch (error) {
    console.log(`error adding friend: ${error}`);
  }
}

export const updateCount = async (id: string, item: ItemStatus, count: number) => {
  try {
    const points = (item === 'selling') ? count * 20 : (item === 'taken') ? count * 15 : (item === 'recycled') ? count * 10 : count * 5;
    console.log('points: ', points);
    const update = { $inc: { [item]: count, points: points} };
    console.log('update: ', update);
    await User.findByIdAndUpdate(id, update);


  } catch (error) {
    console.log(`error updating points: ${error}`);
  }
}

export const updateBadges = async (id: string, badge: string) => {
  try {
  const user = await User.findByIdAndUpdate(id, { $addToSet: { badges: badge} });
  } catch (error) {
    console.log(`error updating badges: ${error}`);
  }
}

export const createItem = async (name: string, imageUrl: string, status: string, count: number, userId: string) => {
  const newItem = new Item({ name, seller: userId, status, count, imageUrl});
  switch (status) {
    case 'recycled':
      await updateCount(userId, 'recycled', count);
      break;
    case 'trash':
      await updateCount(userId, 'trash', count);
      break;
    case 'selling':
      await updateCount(userId, 'selling', count);
      await User.findByIdAndUpdate(userId, { $addToSet: { sellingItems: newItem._id } });
      break;
    default:
      break;
  }
  await User.findByIdAndUpdate(userId, { $addToSet: { items: newItem._id } });
  return await newItem.save();
}

export type ItemStatus = 'recycled' | 'trash' | 'taken' | 'selling' | 'sold';

export const updateItem = async (itemId: string, status: ItemStatus, sellerId: string, count: number, buyerId: string) => {
  console.log('status: ', status);
  if (status === 'taken') {
    const curItem = await Item.findByIdAndUpdate(itemId, { buyer: buyerId, status, count, seller: sellerId });
    await User.findByIdAndUpdate(buyerId, { $addToSet: { takenItems: curItem?._id, items: curItem?._id } });
    // isnt pulling from items
    await User.findByIdAndUpdate(sellerId, { $pull: { sellingItems: curItem?._id, items: curItem?._id }, $inc: { selling: -count }});
    updateCount(buyerId, 'taken', count);
    updateCount(sellerId, 'sold', count);
  } if (status === 'selling' ){
      await User.findByIdAndUpdate(sellerId, { $addToSet: { sellingItems: itemId }, $inc: { selling: count }});
      updateCount(sellerId, 'selling', count);
  } else {
    await Item.findByIdAndUpdate(itemId, { seller: sellerId, status, count });
    await User.findByIdAndUpdate(sellerId, {$addToSet: { items: itemId }});
  }
};

export const findItems = async (sold: boolean) => {
  if (sold) {
    const items = await Item.find({ status: 'taken' }).populate('seller').populate('buyer');
    return items;
  }
  const items = await Item.find({ }).populate('seller').populate('buyer');
  return items;
}

export const findItem = async (id: string) => {
  return await Item.findById(id).populate('seller').populate('buyer');
}
