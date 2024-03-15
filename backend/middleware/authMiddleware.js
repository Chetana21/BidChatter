const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  //check if req object has authorization in its header because  The Authorization header typically carries credentials (such as tokens) that the server can use to verify the identity of the requester and determine whether they are authorized to access the requested resource.

  //Also check if req object starts with bearer because :Bearer tokens are a type of access token that are typically used for authentication, where the client sends the token along with each request to access protected resources.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // extract the JWT token from the header by splitting it and retrieving the second part. This line splits the Authorization header string into an array using whitespace as the delimiter (split(" ")) and retrieves the second element of the array, which represents the token.
      token = req.headers.authorization.split(" ")[1];

      // The extracted token is then verified using jwt.verify with the provided secret key (process.env.JWT_SECRET). If the verification succeeds, the token is decoded, and the user ID (decoded.id) is extracted from it.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //The user ID extracted from the token is used to fetch the corresponding user from the database (await User.findById(decoded.id).select("-password");). The -password argument ensures that the user object returned does not include the password field for security reasons
      // The retrieved user object is attached to the req object as req.user, making it accessible in subsequent middleware functions or route handlers.
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
