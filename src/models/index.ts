// src/models/User.ts

import { getDB } from '../db';

export const findAllUsers = async () => {
  const db = await getDB();
  return await db.collection('users').find({}).toArray();
};

export const insertUser = async (user: any) => {
  const db = await getDB();
  return await db.collection('users').insertOne(user);
};
