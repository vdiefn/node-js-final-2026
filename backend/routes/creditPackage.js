const express = require("express")
const router = express.Router()
const creditPackageController = require("../controllers/creditPackage")

router.get("/", creditPackageController.getCreditPackage)
router.post("/", creditPackageController.createCreditPackage)
router.delete("/:id", creditPackageController.deleteCreditPackage)

module.exports = router