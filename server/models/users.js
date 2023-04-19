import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [10, "Password must be at least 8 characters long"],
    select: false,
  },

  avatar: {
    public_id: String,
    url: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  tasks: [
    {
      title: String,
      description: String,
      completed: Boolean,
      createdAt: Date,
    },
  ],

  verified: {
    type: Boolean,
    default: false,
  },

  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date
});

// userSchema.pre :- This middleware function encrypts the user's password using the "bcrypt" library before saving the user object to the database.

//The purpose of this middleware function is to encrypt the user's password using the "bcrypt" library before saving the user object to the database.

// Whenever user is save ("save") password will become hash
userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  // The line "if(!this.isModified("password"))" checks whether the "password" field has been modified before the "save" event is triggered on the user object.

  //If the "password" field has not been modified, it means that the user object is being saved for some other reason (such as updating a different field), 
  //and the middleware function does not need to hash the password again. In that case, the function simply calls the "next()" 
  //function to pass control to the next middleware function in the stack or save the user object if there are no more middleware functions.

  const salt = await bcrypt.genSalt(10); //If the password has been modified, the function generates a salt using the "bcrypt.genSalt(10)" function. 
  //The salt is used to hash the password using the "bcrypt.hash(this.password, salt)" function.
  this.password = await bcrypt.hash(this.password, salt); 
  // password will become hash
  next();
  //Finally, the hashed password is assigned to "this.password" and the "next()" function is called to pass control to the next middleware 
  //function in the stack or save the user object if there are no more middleware functions.
})



userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE*24*60*60*1000,
  });
};


userSchema.methods.comparePassword = async function (password) { 
  return await bcrypt.compare(password, this.password) // this.password means user.password
};
// so through this we can know if password is same or not
// we will comapre the one with req.body and check if it is present
// in database

userSchema.index({otp_expiry:1}, {expireAfterSeconds: 0})
// its ttl mongodb:- here any document gets deleted after given period 
//of time

// otp_expiry:1 :- 1 is for true  
// expireAfterSeconds: 0 :- it will expire after 0 sec 




export const User = mongoose.model("User", userSchema);
