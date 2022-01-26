const express = require("express")
const router = express.Router()
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const checkUser = require("../middleware/checkUser")
const checkToken = require("../middleware/checkUser")

const validateBody = require("../middleware/validateBody")
// const validateId = require("../middleware/validateId")
const { Project, projectAddJoi, projectEditJoi } = require("../models/Project")
const { Comment } = require("../models/Comment")

// all project////
router.get("/", async (req, res) => {
  const projects = await Project.find()

  //   .populate({
  //     path:'comments',
  //     populate:{
  //       path:"owner",
  //       select:"-password -email  -role"
  //     },
  // })
  res.json(projects)
})

// one project by id/////
router.get("/:id", checkId, async (req, res) => {
  try {
    const project = await project
      .findById(req.params.id)

      .populate({
        path: "comments",
        populate: {
          path: "owner",
          select: "-password -email  -role",
        },
      })

    if (!project) return res.status(404).send("project not found")
    res.json(project)
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message)
  }
})

//// add by user////
router.post("/add-project", checkUser, validateBody(projectAddJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, field } = req.body

    const project = new Project({
      title,
      description,
      image,
      video,
      date,
      demoLink,
      gitHubLink,
      type:"User",
      field,
      owner:req.userId,
    })

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

////////// add by company/////////
router.post("/add-project-company", checkCompany, validateBody(projectAddJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, field } = req.body

    const project = new Project({
      title,
      description,
      image,
      video,
      date,
      demoLink,
      gitHubLink,
      type:"Company",
      field,
      owner:req.companyId,
    })

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//////////add by admain/////////
router.post("/add-project-admain", checkAdmin, validateBody(projectAddJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, field } = req.body

    const project = new Project({
      title,
      description,
      image,
      video,
      date,
      demoLink,
      gitHubLink,
      type:"General",
      field,
    })

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//edit by user///////
router.put("/editUser/:id", checkUser, checkId, validateBody(projectEditJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, type, field } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, image, video, date, demoLink, gitHubLink, type, field } },
      { new: true }
    )
    if (!project) return res.status(404).json("project not found")
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//by company
router.put("/:id", checkCompany, checkId, validateBody(projectEditJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, type, field } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, image, video, date, demoLink, gitHubLink, type, field } },
      { new: true }
    )
    if (!project) return res.status(404).json("project not found")
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//edit by admain
router.put("/admain/:id", checkAdmin, checkId, validateBody(projectEditJoi), async (req, res) => {
  try {
    const { title, description, image, video, date, demoLink, gitHubLink, type, field } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, image, video, date, demoLink, gitHubLink, type, field } },
      { new: true }
    )
    if (!project) return res.status(404).json("project not found")
    res.json(project)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//delet by just admain
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    await Comment.deleteMany({ projectId: req.params.id })

    const project = await Project.findByIdAndRemove(req.params.id)
    if (!project) return res.status(404).send("project not found")
    res.send("project is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = router
