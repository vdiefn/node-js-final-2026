const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()

const { healthcheck } = require("./controllers/healthcheck")
const routes = require("./routes")
const PORT = Number(process.env.PORT)


app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`)
})