const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Joi = require("joi")  
require("dotenv").config()
const JoiObjectId = require("joi-objectid")
Joi.objectid = JoiObjectId(Joi)
const projects = require("./routes/projects")
const comments = require("./routes/comments")
const companies = require("./routes/companies")
const offers = require("./routes/offers")
const users = require("./routes/users")


mongoose
  .connect("mongodb://localhost:27017/projectDB")
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log("Error connecting to MongoDB ", error))

  const app = express()
app.use(express.json())

app.use(cors())
app.use("/api/auth", users)
app.use("/api/projects",projects)
app.use("/api/companies",companies)
app.use("/api/projects/comments",comments)
app.use("/api/projects/offers",offers)



const port = 5000
app.listen(port, () => {
  console.log("server is listening on port:" + port)
})