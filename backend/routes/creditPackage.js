const express = require("express");
const router = express.Router();
const creditPackageController = require("../controllers/creditPackage");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", creditPackageController.getCreditPackage);
router.post("/", creditPackageController.createCreditPackage);
router.delete("/:id", creditPackageController.deleteCreditPackage);
router.post("/:creditPackageId", verifyToken, creditPackageController.purchaseCreditPackage);

module.exports = router;
