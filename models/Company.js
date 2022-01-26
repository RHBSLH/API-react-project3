const mongoose = require("mongoose")
const Joi = require("joi")

const companySchema = new mongoose.Schema({
  companyName: String,
  aboutUs: String,
  projects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  offers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Offer",
    },
  ],
  logo: String,
  email: String,
  password: String,
  subscription: Date,
  role:{
    type:String,
    enum: ["Admin", "Company"],
  },
})

//sign company joi
const signupCopmanyJoi = Joi.object({
  companyName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  logo: Joi.string().uri().min(2).max(100000),
  
})

//login by company
const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})

//joi subscription
const subCompanyJoi = Joi.object({
  date: Joi.date().required(),
})

const companyEditProfile = Joi.object({
  companyName: Joi.string().min(2).max(100).required(),
  aboutUs: Joi.string().min(2).max(1000),
  email: Joi.string().email(),
  logo: Joi.string().uri().min(2).max(100000),
})

const Company = mongoose.model("Company", companySchema)
module.exports.Company = Company

module.exports.companyEditProfile = companyEditProfile
module.exports.signupCopmanyJoi = signupCopmanyJoi
module.exports.subCompanyJoi = subCompanyJoi
module.exports.loginJoi = loginJoi
