const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require("../controllers/chatControllers");
//Create an instance of a router from express.Routers in Express are used to group related routes.
const router = express.Router();
//First route will be used for accessing/creating the chat and this rute can be accessed only if user is lgggedin so we wil call protect middleware first. 
router.route('/').post(protect,accessChat);
 router.route("/").get(protect, fetchChats);

// //Creation of group
 router.route("/group").post(protect, createGroupChat);
// //Renaming th group
router.route("/rename").put(protect, renameGroup);
// //Add someone to the group
router.route("/groupadd").put(protect, addToGroup);
// //Remove the group
router.route("/groupremove").put(protect, removeFromGroup);


module.exports=router;