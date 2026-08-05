const express = require("express")
const router = express.Router()
const healthcheckController = require("../controllers/healthcheck")

router.get("/", healthcheckController.healthcheck)

module.exports = router