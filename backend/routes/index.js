const express = require("express")
const router = express.Router()
const healthcheckRouter = require("./healthcheck")
const coachRouter = require("./coach")

router.use("/healthcheck", healthcheckRouter)
router.use("/api/coaches/skill", coachRouter)

module.exports = router