const express = require("express")
const router = express.Router()
const coachController = require("../controllers/coach")

router.get("/", coachController.getCoachSkill)
router.post("/", coachController.createCoachSkill)
router.delete("/:id", coachController.deleteCoachSkill)

module.exports = router