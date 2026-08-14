const express = require("express")
const router = express.Router()
const courseController = require("../controllers/course")

router.get("/", courseController.getCourses)
router.post("/:courseId", courseController.bookCourse)
router.delete("/:courseId", courseController.cancelCourse)

module.exports = router