const express = require("express")
const router = express.Router()
const coachController = require("../controllers/coach")
const verifyToken = require("../middlewares/verifyToken")

router.get("/", verifyToken, coachController.getCoach)
router.put("/", verifyToken, coachController.updateCoach)

router.get("/courses", coachController.getCoachCourse)
router.post("/courses", coachController.createCourse)

router.get("/courses/:courseId", coachController.getCourseDetail)
router.put("/courses/:courseId", coachController.updateCourseDetail)

router.post("/:userId", coachController.createCoach)




module.exports = router

