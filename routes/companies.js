const express = require("express")
const router = express.Router()
const checkAdmin = require("../middleware/checkAdmin")
const checkCompany = require("../middleware/checkCompany")
const checkId = require("../middleware/checkId")
const validateId = require("../middleware/validateId")
const validateBody = require("../middleware/validateBody")
const { Company, loginJoi, signupCopmanyJoi, companyEditProfile, subCompanyJoi } = require("../models/Company")
const jwt = require("jsonwebtoken")

const Project = require("../models/Project")
const bcrypt = require("bcrypt")

//sign by  company
router.post("/signup", validateBody(signupCopmanyJoi), async (req, res) => {
  try {
    const { companyName, email, password, logo } = req.body
    const userFound = await Company.findOne({ email })
    if (userFound) return res.status(400).send("company already registered")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new Company({
      companyName,
      email,
      password: hash,
      logo,  
      role: "Company",
    })

    await user.save()
    delete user._doc.password
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//login by copmany
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const company = await Company.findOne({ email })
    if (!company) return res.status(404).json("company not found")

    const valid = await bcrypt.compare(password, company.password) //مقارنه بين الكلمتين في تسجيل الدخول و الدخول
    if (!valid) return res.status(400).json("password incorrect")

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//all copmany for any one
router.get("/", async (req, res) => {
  const companies = await Company.find()
    .populate("projects").populate("subscription")
    .select("-password  -__v")
    
  res.json(companies)
})

//company get peofile
router.get("/profile", checkCompany, async (req, res) => {
  const company = await Company.findById(req.companyId).select("-__v -password").populate({
    path: "offers",
    populate: "projectName",
  })
  res.json(company)
})

//edit profile

router.put("/profile/:id", checkCompany, validateBody(companyEditProfile), async (req, res) => {
  try {
    const { aboutUs, logo,companyName } = req.body

    const company = await Company.findByIdAndUpdate(req.params.id, { $set: { aboutUs, logo,companyName } }, { new: true })
    if (!company) return res.status(404).json("company not found")
    res.json(company)
  } catch (error) {
    res.status(500).json(error.message)
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
// راوت اضافه sub عن طريق admain
router.post("/:companyId/sub", checkAdmin, validateId("companyId"), validateBody(subCompanyJoi), async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId)
    if (!company) return res.status(404).send("company not found")

    const { date } = req.body

    await Company.findByIdAndUpdate(req.params.companyId, { $set: { subscription: date } }, { new: true })

    res.send("sub add")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})
module.exports = router
