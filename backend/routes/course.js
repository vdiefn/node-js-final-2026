const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course")

router.get("/", courseController.getCourses)

module.exports = router