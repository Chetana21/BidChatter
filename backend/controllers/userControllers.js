const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
//Import generatetoken function
const generateToken=require('../config/generateToken ');
//Define the registerUser controller function, which handles user registration
const registerUser = asyncHandler(async (req,res) => {
  const { name, email, password, pic, biddingType, role } = req.body;
  //If any of these is undefined, then we re gonna throw an error.
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields!");
  }
  //User model provides methods to interact with the database collection, such as findOne, findById, etc
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  //Create a new user in the User database using User.create.
  const user = await User.create({
    name,
    email,
    password,
    pic,
    biddingType,
    role,
  });

  //If new field is successfully created then send the below response of json file to the client.
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

//Define the authUser controller function, which handles user login
const authUser=asyncHandler(async(req,res)=>{
const {email,password}=req.body;
//Check if a user exists using email. 
const user=await User.findOne({email});
//If user exists, and password matches, send json data to client else throw an error.
if(user &&(await user.matchPassword(password)) ){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token:generateToken(user._id),
    });
} 
else{
    res.status(401);
    throw new Error( "Invalid Email or Password");
}
});

// The api will look like /api/user/search=BidChatter , here search is a keyword variable and similarly we can provide other variables as well over here.
const allUsers=asyncHandler(async(req,res)=>{
  //If there is any query given then we will search the user in their name and email
  const keyword = req.query.search
    ? {
        //We use this or operator from mongodb and see if either of the conditions match means either of email or the name matches and providing i inside options says its case sensitive.
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : //if patterns dotn match do nothing
      {};
  //console.log(keyword);
  //Now we would like to return all users that the above search result giave us EXCEPT the user that is currently logged in to avoid chatting with themselves only. That is the reson we write $ne means not equal to id of the loggedin user.

  //In order to get this req,user,id we want our user to be logged in and provide us the json web token
  const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
  res.send(users);
});
module.exports = { registerUser, authUser, allUsers };
 