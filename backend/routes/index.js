const express = require("express")
const router = express.Router()
const healthcheckRouter = require("./healthcheck")
const skillRouter = require("./skill")
const creditPackageRouter = require("./creditPackage")
const userRouter = require("./user")

router.use("/healthcheck", healthcheckRouter)
router.use("/api/coaches/skill", skillRouter)
router.use("/api/credit-package", creditPackageRouter)
router.use("/api/users", userRouter)

module.exports = router