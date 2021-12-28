const jwt = require("jsonwebtoken")
const { Company } = require("../models/Company")

const checkCompany = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).send("token is required")

  const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
  const companyId = decryptedToken.id

  const company = await Company.findById(companyId)
  if (!company) return res.status(404).send("company not found")

  req.companyId = companyId
  next()
}
module.exports = checkCompany
