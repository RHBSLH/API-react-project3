const express = require("express")
const router = express.Router()
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const checkUser = require("../middleware/checkUser")
const checkToken = require("../middleware/checkUser")

const validateBody = require("../middleware/validateBody")
const validateId = require("../middleware/validateId")
const { Project, projectAddJoi, projectEditJoi } = require("../models/Project")
const { Comment, commentJoi } = require("../models/Comment")
const { User } = require("../models/User")

//COMMENT// هنا ربطته مع project عشان بعد / احط كومنت

router.get("/:projectId/comments", checkId, async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
    res.json(comments)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

//by user
router.post("/:projectId/comments", checkUser, validateId("projectId"), validateBody(commentJoi), async (req, res) => {
  try {
    const { comment } = req.body
    //لازم اتاكد من وجود البروجكت
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).send("project not found")
    // هنا صنعت الكومنت و اضفت له التوكن
    const newComment = new Comment({ comment, owner: req.userId, projectId: req.params.projectId })

    await Project.findByIdAndUpdate(req.params.projectId, { $push: { comments: newComment._id } })

    await newComment.save()

    res.json(newComment)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

//by user
router.put(
  "/:projectId/comments/:commentId",
  checkUser,
  validateId("projectId", "commentId"),
  validateBody(commentJoi),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId)
      if (!project) return res.status(404).send("project not found")

      const { comment } = req.body

      const commentFound = await Comment.findById(req.params.commentId)
      if (!commentFound) return res.status(404).send("comment not found")

      if (commentFound.owner != req.userId) return res.status(403).send("unauuthorized action")

      const updateComment = await Comment.findByIdAndUpdate(req.params.commentId, { $set: { comment } }, { new: true })

      res.json(updateComment)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
)

//by user
router.delete("/:projectId/comments/:commentId", checkUser, validateId("projectId", "commentId"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).send("project not found")

    const CommentFound = await Comment.findById(req.params.commentId)
    if (!CommentFound) return res.status(404).send("comment not found")

    const user = await User.findById(req.userId)
    if (user.role !== "Admin" && CommentFound.owner != req.userId) return res.status(403).send("unauthorized action")

    await Project.findByIdAndUpdate(req.params.projectId, { $pull: { comments: CommentFound._id } })
    await Comment.findByIdAndRemove(req.params.commentId)
    res.json("comment is removed")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
