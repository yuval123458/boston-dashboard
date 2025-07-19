const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToMongo() {
  await client.connect();
  db = client.db("boston");
  console.log("Connected to MongoDB");
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
module.exports = { connectToMongo, getDb };
