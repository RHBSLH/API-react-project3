const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  // emailVerified:{
  //   type:Boolean,// تحققق بعدين
  //   default:false,
  // },
  password: String,
  avatar: String,
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  projects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  offers:
    {
      type: mongoose.Types.ObjectId,
      ref: "Offer",
    },
     
  role:{
    type:String,
    enum: ["Admin", "User"],
  },
 
  
})
//sign user joi
const signupUserJoi = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  avatar: Joi.string().uri().min(2).max(100000),
})




const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})

const profileJoi = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
   password: Joi.string().min(6).max(100),
  avatar: Joi.string().uri().min(2).max(10000).required(),
  project :Joi.array().items(Joi.objectid()).min(1),
  offers : Joi.array().items(Joi.objectid()).min(1),
})


const User = mongoose.model("User", userSchema)
module.exports.User = User
module.exports.signupUserJoi = signupUserJoi

module.exports.loginJoi = loginJoi
module.exports.profileJoi = profileJoi
