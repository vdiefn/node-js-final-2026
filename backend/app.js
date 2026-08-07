const express = require("express")
const cors = require("cors")
const { dataSource } = require("./db/data-source")
const app = express()
require("dotenv").config()

const { healthcheck } = require("./controllers/healthcheck")
const routes = require("./routes")
const PORT = Number(process.env.PORT)

app.use(cors())
app.use(express.json())
app.use(routes)
app.use((req, res) => {
  res.status(404).json({status:"error", message:"路由不存在"})
})
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({status:"error", err:err.name, message:err.message})
})

module.exports = app