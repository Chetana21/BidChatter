//Import express
const express = require("express");
//Import data inside data.js file
const { chats } = require("./data/data.js");
//Import data inside DOTENV file
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const colors = require("colors");
//Create an intance of express variable
const app = express();
dotenv.config();
//Connecting the database
connectDB();
// Creating ExpressJS API
app.get("/", (req, res) => {
  res.send("API is running successfully");
});
// Creating DummyData API
app.get("/api/chat", (req, res) => {
  res.send(chats);
});
// Creating DummyData API to get a single instance.
app.get("/api/chat/:id", (req, res) => {
  //console.log(req);
  const singleChat = chats.find((c) => c._id === req.params.id);
  //     console.log("Requested ID:", req.params.id);
  // console.log("All Chats:", chats);
  res.send(singleChat);
});

//With the help of app variable we can start our own server which listens on a particular port which can be decided by us only.
const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`Server started on port ${PORT}`.yellow.bold));
