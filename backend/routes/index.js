const express = require("express")
const router = express.Router()
const healthcheckController = require("../controllers/healthcheck")

router.get("/healthcheck", healthcheckController.healthcheck)

module.exports = router