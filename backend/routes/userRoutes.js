const express = require("express");
//Create an instance of a router from express.Routers in Express are used to group related routes.
const router = express.Router();
//Import regosterUser controleler
const {
  registerUser,
  authUser,
  allUsers,

} = require("../controllers/userControllers");
const {protect}=require ("../middleware/authMiddleware");
//Now, use this router to create different routes.
//So, give one endpoint for login and one endpoint for registration,later we want to create an api enpoint for UserSearch and hence we append both regosterUser endpoint for post req an getAllUsers endpoint for UserSearch 
router.route("/").post(registerUser).get(protect,allUsers);
router.post('/login',authUser);

module.exports = router;
