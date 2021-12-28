const mongoose = require("mongoose")
const Joi = require("joi")

const commentSchema = new mongoose.Schema({
   

    comment:String,
projectId:{
  type:mongoose.Types.ObjectId,
  ref:"Project"
},
    owner: 
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      
  })

  const commentJoi = Joi.object({
    comment: Joi.string().min(2).max(1000).required(),
 })

  const Comment = mongoose.model("Comment", commentSchema)
module.exports.Comment = Comment
module.exports.commentJoi = commentJoi