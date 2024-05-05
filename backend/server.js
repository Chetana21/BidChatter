//Import express
const express = require("express");
//Import data inside data.js file
const { chats } = require("./data/data.js");
//Import data inside DOTENV file
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const colors = require("colors");
//Import usrRouter
const userRoutes=require('./routes/userRoutes');
//Import chatRouter
const chatRoutes=require('./routes/chatRoutes.js');
//Import Message Router
const messageRoutes=require("./routes/messageRoutes.js")
//Import Product Routes
const productRoutes=require("./routes/productRoutes.js")
//Import errorhandlers
const {notFound,errorHandler} = require("./middleware/errorMiddleware.js");
//Create an intance of express variable
const app = express();

//Tell server to accept the json data coming from frontend.
app.use(express.json());
dotenv.config();
//Connecting the database
connectDB();
// Creating ExpressJS API
app.get("/", (req, res) => {
  res.send("API is running successfully");
});
// // Creating DummyData API
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// // Creating DummyData API to get a single instance.
// app.get("/api/chat/:id", (req, res) => {
//   //console.log(req);
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   //     console.log("Requested ID:", req.params.id);
//   // console.log("All Chats:", chats);
//   res.send(singleChat);
// });

//Write for actual data Or any requests made to paths starting with /api/user will be handled by the userRoutes middleware.
//This Middleware functions can handle various types of requests (GET, POST, etc.) and perform actions like authentication, logging, or request processing.
app.use('/api/user',userRoutes);
//Create a new api endpoint to handle chats
app.use('/api/chat',chatRoutes);
//Create a ner API Endpoint to handle the messeges
app.use("/api/message", messageRoutes);
//Create a new API Endpoint ot handle Product Information
app.use("/api/productPage",productRoutes);
//Errror handlers  one  for url not found and next for  other errors. 
app.use(notFound);
app.use(errorHandler);

//With the help of app variable we can start our own server which listens on a particular port which can be decided by us only.
const PORT = process.env.PORT || 5000;
const server=app.listen(5000, console.log(`Server started on port ${PORT}`.yellow.bold));
const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000",
  },
  });

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    //console/log(userData);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});