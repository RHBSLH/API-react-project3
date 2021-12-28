const mongoose = require("mongoose")
const Joi = require("joi")


const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image:String,
    video:String,
    date:String,
    demoLink:String,
    gitHubLink:String,
    type:{
      type:String,
      enum: ["General","User","Company"],
      },
    field:{
    type:String,
    enum: ["Industry", "Commercial","Education","Healthy","Entertainment","culture"],
    },
     comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    
    offers:[
    {
      type: mongoose.Types.ObjectId,
      ref: "Offer",
    },]
    
  })

  const projectAddJoi = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(5).max(1000).required(),
    image: Joi.string().uri().min(2).max(1000).required(),
    date:  Joi.string().min(1).max(200).required(),
    demoLink:Joi.string().uri().min(2).max(1000).required(),
    gitHubLink:Joi.string().uri().min(2).max(1000).required(),
    video:Joi.string().uri().min(2).max(1000),
    // type: Joi.string().valid("General","User","Company").required(),
    field: Joi.string().valid("Industry", "Commercial","Education","Healthy","Entertainment","culture").required(),
  })

  const projectEditJoi = Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().min(5).max(1000),
    image: Joi.string().uri().min(2).max(1000),
    date:  Joi.string().min(1).max(200),
    demoLink:Joi.string().uri().min(2).max(1000),
    gitHubLink:Joi.string().uri().min(2).max(1000),
    video:Joi.string().uri().min(2).max(1000),
    type: Joi.string().valid("General","User","Company"),
    field: Joi.string().valid("Industry", "Commercial","Education","Healthy","Entertainment","culture"),
  })


  const Project = mongoose.model("Project", projectSchema)

module.exports.Project = Project
module.exports.projectAddJoi= projectAddJoi
module.exports.projectEditJoi= projectEditJoi