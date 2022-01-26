const mongoose = require("mongoose")
const Joi = require("joi")

const commentSchema = new mongoose.Schema({
   

    comment:String,
projectId:{          //projectId نحدده من الرابط 
  type:mongoose.Types.ObjectId,
  ref:"Project"
},
    owner: //owner نحدده من التوكن
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      
  })
// في body نرسل بس comment م يحتاج نحدد user
  const commentJoi = Joi.object({
    comment: Joi.string().min(2).max(1000).required(),
 })// joi عباره عن الشيء الي بنحدده في body 

  const Comment = mongoose.model("Comment", commentSchema)
module.exports.Comment = Comment
module.exports.commentJoi = commentJoi