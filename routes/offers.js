const express = require("express")
const router = express.Router()
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const checkToken = require("../middleware/checkUser")
const validateBody = require("../middleware/validateBody")
const { Company } = require("../models/Company")
const { Offer, offerJoi } = require("../models/Offer")
const { Project } = require("../models/Project")
const { User } = require("../models/User")


router.get("/:id", checkAdmin, checkId,async (req, res) => {
  try {
    const offers = await Offer.find().populate("commpanyName").populate("projectName")
    res.json(offers)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get("/:offerId/activate", checkAdmin, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.offerId, { $set: { activate: true } })
    const project = await Project.findById(offer.projectName)
    await User.findByIdAndUpdate(project.owner, { $push: { offers: req.params.offerId } })
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//add offers by company
router.post("/:projectId", checkCompany, validateBody(offerJoi), async (req, res) => {
  try {
    const company = await Company.findById(req.companyId)
    let activated
    if (!company.subscription || Date.now() - company.subscription > 0) {
      activated = false
    } else activated = true
const offerFound= await Offer.findOne({commpanyName: req.companyId , projectName: req.params.projectId,})
if (offerFound) return res.status(400).json("you already ordered")

    const offer = new Offer({
      commpanyName: req.companyId,

      projectName: req.params.projectId,
      activated, //
    })

    const project = await Project.findById(req.params.projectId)

    await Company.findByIdAndUpdate(req.companyId, { $push: { offers: offer._id } })
    if (activated) await User.findByIdAndUpdate(project.owner, { $push: { offers: offer._id } })

    await offer.save()
    res.json(offer)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

///delet by company
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndRemove(req.params.id)

    if (!offer) return res.status(404).json("offer not found")
    res.json("offer is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

///delet by Admain
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const company = await Company.findByIdAndRemove(req.params.id)

    if (!company) return res.status(404).json("company not found")
    res.json("company is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
