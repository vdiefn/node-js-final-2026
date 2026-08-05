const express = require("express")
const router = express.Router()
const healthcheckRouter = require("./healthcheck")
const coachRouter = require("./coach")

router.use("/healthcheck", healthcheckRouter)
router.use("/coaches", coachRouter)

module.exports = router