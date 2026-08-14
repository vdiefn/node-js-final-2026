const express = require("express")
const router = express.Router()
const adminCoachController = require("../controllers/adminCoach")
const verifyToken = require("../middlewares/verifyToken")
const isCoachAuth = require("../middlewares/isCoachAuth")

router.get("/", verifyToken, isCoachAuth, adminCoachController.getCoach)
router.put("/", verifyToken, adminCoachController.updateCoach)

router.get("/courses", verifyToken, isCoachAuth, adminCoachController.getCoachCourse)
router.post("/courses", verifyToken, isCoachAuth, adminCoachController.createCourse)

router.get("/courses/:courseId", verifyToken, adminCoachController.getCourseDetail)
router.put("/courses/:courseId", verifyToken, adminCoachController.updateCourseDetail)

router.post("/:userId", adminCoachController.createCoach)




module.exports = router

