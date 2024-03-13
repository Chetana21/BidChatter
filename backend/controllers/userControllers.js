const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
//Import generatetoken function
const generateToken=require('../config/generateToken ');
//Define the registerUser controller function, which handles user registration
const registerUser = asyncHandler(async (req,res) => {
  const { name, email, password, pic } = req.body;
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
  });

  //If new field is successfully created then sen the below response of json file to the user.
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
module.exports={registerUser,authUser};
