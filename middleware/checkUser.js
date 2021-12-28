const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkUser = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).send("token is required")

  const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
  const userId = decryptedToken.id

  const user = await User.findById(userId)
  if (!user) return res.status(404).send("user not found")

  req.userId = userId
  next()
}
module.exports = checkUser
