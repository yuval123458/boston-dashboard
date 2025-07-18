const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToMongo } = require("./db");
const dealsRoutes = require("./routes/deals");
const chatRoutes = require("./routes/chatAssistant");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/deals", dealsRoutes);
app.use("/api/chat", chatRoutes);

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
