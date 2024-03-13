const jwt=require('jsonwebtoken');

const generateToken=(id)=>{
    //Sign token with unique id. 
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn:"30d",
    });
};
module.exports=generateToken;