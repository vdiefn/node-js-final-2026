const express = require("express")
const router = express.Router()
const coachController = require("../controllers/coach")

router.get("/:coachId/courses", coachController.getOneCoachCourse)

router.get("/:coachId", coachController.getCoachDetail)

router.get("/", coachController.getCoaches)

module.exports = router