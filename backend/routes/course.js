const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", courseController.getCourses);
router.post("/:courseId", verifyToken, courseController.bookCourse);
router.delete("/:courseId", verifyToken, courseController.cancelCourse);

module.exports = router;
