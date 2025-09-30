const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

mongoose.connect(MONGODB_URI);

app.use(express.json());
app.use(cors());

// Health check endpoint for AWS App Runner / ECS
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
