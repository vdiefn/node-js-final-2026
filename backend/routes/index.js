const express = require("express")
const router = express.Router()
const healthcheckRouter = require("./healthcheck")
const skillRouter = require("./skill")
const creditPackageRouter = require("./creditPackage")
const userRouter = require("./user")
const adminCoachRouter = require("./adminCoach")
const coachRouter = require("./coach")
const courseRouter = require("./course")

router.use("/healthcheck", healthcheckRouter)
router.use("/api/coaches/skill", skillRouter)
router.use("/api/credit-package", creditPackageRouter)
router.use("/api/users", userRouter)
router.use("/api/admin/coaches", adminCoachRouter)
router.use("/api/coaches", coachRouter)
router.use("/api/courses", courseRouter)

module.exports = router