const mongoose = require("mongoose")
const Joi = require("joi")

const offersSchema = new mongoose.Schema({
   commpanyName:
   {
    type: mongoose.Types.ObjectId,
    ref: "Company",
  },
  // userName:{
  //   type: mongoose.Types.ObjectId,
  //   ref: "User",
  // },
  projectName:{
    type: mongoose.Types.ObjectId,
    ref: "Project",
  },
  activated:Boolean
   })

   const offerJoi = Joi.object({
    projectName: Joi.objectid()
 })

  const Offer = mongoose.model("Offer", offersSchema)
module.exports.Offer = Offer
module.exports.offerJoi = offerJoi