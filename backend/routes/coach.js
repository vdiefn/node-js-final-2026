const express = require("express")
const router = express.Router()
const coachController = require("../controllers/coach")

router.get("/skill", coachController.getCoachSkill)
router.post("/skill", coachController.createCoachSkill)

module.exports = router