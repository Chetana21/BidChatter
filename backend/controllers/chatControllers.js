const asyncHandler = require("express-async-handler");
//Import the chat model
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
//Creates/feteches one on one chat
const accessChat = asyncHandler(async (req, res) => {
  //Take user id which will be sent by the current user which is logged in this will be the id of the user with whom the user wants to create a chat
  const { userId } = req.body;
  //Check if a chat with the given userid exists with the current user then return it else create a new chat
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      // This condition checks if the current user (identified by req.user._id) is present in the users array of the chat document. The $elemMatch operator ensures that at least one element in the users array matches the specified condition. Here, $eq is used to check if the element equals
      { users: { $elemMatch: { $eq: req.user._id } } },
      //{ users: { $elemMatch: { $eq: userId } } }: Similar to the previous condition, this checks if the user identified by userId is present in the users array of the chat document
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    //Once the chat documents are retrieved, if any, they are populated with additional data before sending the response back to the client. This additional data may include user details, such as usernames or profile pictures, and the latest message in the chat.
    .populate("users", "-password")
    .populate("latestMessage");
  //Also we will populate the sender field which is inside the messege model
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  //This block checks if any chat documents were found based on the query criteria. If chats are found (isChat.length > 0), it sends the first chat document found back as a response.
  // If no chats are found, it creates a new chat document between the current user (req.user._id) and the user identified by userId.
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //If no chat is found, the code proceeds to create a new chat document.
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      //Then, it attempts to create a new chat using Chat.create(chatData).
      const createdChat = await Chat.create(chatData);
      // After creating the chat, it retrieves the newly created chat document using Chat.findOne() and populates the users field to include user details, excluding passwords.
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  //Check which user is logged in and query  all chats that exosts in db for that user
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      //Sort based based on new to old wrt the updated array
      .sort({ updatedAt: -1 })
      //Also populate the sender field which is inside the message model.
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  //Here the we have sent an arrray from the fronend, but we cant send it directly so we have to send it in the stringify foramat so, after coming here to the be, we need to parse it whic means process of converting a JSON string into a JavaScript array object
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  //The current user (the one making the request) is added to the users array.
  users.push(req.user);
  //It attempts to create a new chat document for the group chat using the Chat.create() method. It includes the group chat's name, users array, indication that it's a group chat (isGroupChat: true), and the group's administrator (groupAdmin: req.user).
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    // After creating the group chat, it retrieves the newly created chat document and populates it with user details and group admin details (excluding passwords) using the populate() method.
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const renameGroup=asyncHandler(async(req,res)=>{
const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      //It gives us the updated value of the chatname
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
})
const addToGroup=asyncHandler(async(req,res)=>{
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    //Provide
    chatId,
    //Update
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};
