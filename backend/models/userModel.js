const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

//Check if password matches the actual password
userSchema.methods.matchPassword=async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
}
//The below code will encrypt the passowrd before saving to the databse. 
userSchema.pre("save", async function (next) {
  //If password isnt modified
  if (!this.isModified) {
    //Move on to next and dont execute code afer it
    next();
  }

  //OW generate a new password
  const salt=await bcrypt.genSalt(10);//The higher the number here 10 te more strong salt will be genrated
  //Hash the new password with salt
  this.password= await bcrypt.hash(this.password,salt)
});
const User = mongoose.model("User", userSchema);

module.exports = User;
