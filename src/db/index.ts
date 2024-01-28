import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
const uri = "mongodb+srv://dbuser:Password!@wastewell0.3kswrta.mongodb.net/?retryWrites=true&w=majority";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// export async function runDB() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// export async function getDB() {
//   await client.connect();
//   return client.db("everything");
// }
mongoose.connect(uri).then(() => {
  console.log('Successfully connected to MongoDB');
  // You can add additional initialization or a ping command here if needed
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export const getDB = () => {
  if (!db) {
      throw new Error('Database not initialized');
  }
  return db;
}


// run().catch(console.dir);