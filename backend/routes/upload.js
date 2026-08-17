const express = require("express")
const router = express.Router()
const verifyToken = require("../middlewares/verifyToken")
const isCoachAuth = require("../middlewares/isCoachAuth")
const uploadController = require("../controllers/upload")
const upload = require("../middlewares/multer")

router.post("/", verifyToken, upload.single("file"), uploadController.handleUpload)

module.exports = router