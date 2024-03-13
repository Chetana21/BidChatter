const express = require("express");
//Create an instance of a router from express.Routers in Express are used to group related routes.
const router = express.Router();
//Import regosterUser controleler
const {registerUser,authUser} = require('../controllers/userControllers');
//Now, use this router to create different routes.
//So, give one endpoint for login and one endpoint for registration
router.route('/').post(registerUser)
router.post('/login',authUser);

module.exports = router;
