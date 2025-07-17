// backend/db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToMongo() {
  await client.connect();
  db = client.db("botson");
  console.log("Connected to MongoDB");
}

function getDb() {
  return db;
}

module.exports = { connectToMongo, getDb };
