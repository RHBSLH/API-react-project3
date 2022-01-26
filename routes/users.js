const express = require("express")
const router = express.Router()
const { User, signupUserJoi, loginJoi, profileJoi, profileEditJoi } = require("../models/User")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const checkUser = require("../middleware/checkUser")
const validateBody = require("../middleware/validateBody")
const checkAdmin = require("../middleware/checkAdmin")
const checkId = require("../middleware/checkId")
//get users   *Admin*

router.get("/users", checkAdmin, async (req, res) => {
  const users = await User.find()
  res.json(users)
})
//by user
router.post("/signup", validateBody(signupUserJoi), async (req, res) => {
  try {
    const { userName, email, password, avatar } = req.body
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already registered")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({
      userName,
      email,
      password: hash,
      avatar,
      role: "User",
    })

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.SENDER_EMAIL,
    //     pass: process.env.SENDER_PASSWORD,
    //   },
    // })
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    // await transporter.sendMail({
    //   from: `rehab Alghamdi <${process.env.SENDER_EMAIL}`,
    //   to: email,
    //   subject: "EMAIL VERIFICATION",
    //   html: `HELLO, pleace click on this link to verify your email.
    //   <a href="http://localhost:3000/email_verified/${token}"> verify email</a>`,
    // })
    await user.save()
    delete user._doc.password
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//login by user
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not found")

    const valid = await bcrypt.compare(password, user.password) //مقارنه بين الكلمتين في تسجيل الدخول و الدخول
    if (!valid) return res.status(400).json("password incorrect")

    // if (!user.emailVerified) return res.status(403).send("user not verified,please check your email")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/profile", checkUser, async (req, res) => {
  const user = await User.findById(req.userId).select("-__v -password").populate({
    path: "offers",
    populate: "projectName",
  })
  res.json(user)
})

router.put("/profile/:id", checkUser, validateBody(profileEditJoi), async (req, res) => {
  try {
    const { userName, avatar } = req.body

    const user = await User.findByIdAndUpdate(req.params.id, { $set: { userName, avatar } }, { new: true }).select(
      "-__v -password"
    )
    if (!user) return res.status(404).json("user not found")
    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//by users
router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)

    if (!user) return res.status(404).json("user not found")
    res.json("user is removed")
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

// /////////verify_email/////////////////
// router.get("/verify_email/:token", async(req, res) => {
//   try{
//  const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY)
//  const userId = decryptedToken.id
//  const user = await User.findByIdAndUpdate(userId, {$set: {emailVerified: true}})
//  if(!user) return res.status(404).send("user not found")

//  res.send("user verified")
//   }catch(error){
//   res.status(500).send(error.message)
//   }
// })

////////////////admin//////////////////

router.post("/add-admin", validateBody(signupUserJoi), async (req, res) => {
  try {
    const { userName, email, password, avatar } = req.body // م يحتاج نسوي كونست ع طول

    const userFound = await User.findOne({ email }) // نتحقق من تسجيل المستخدم بالايمل
    if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      userName,
      email,
      password: hash, //تكون مشفره
      avatar,
      role: "Admin",
    })

    await user.save() //نحفظ في داتا
    delete user._doc.password //يحذف الباسوور بعد ما يحفظ الحساب

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/login/admin", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not found")
    if (user.role != "Admin") return res.status(403).send("you are not admin")

    const valid = await bcrypt.compare(password, user.password) //مقارنه بين الكلمتين في تسجيل الدخول و الدخول
    if (!valid) return res.status(400).json("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
module.exports = router
