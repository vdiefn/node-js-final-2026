const express = require("express")
const router = express.Router()
const skillController = require("../controllers/skill")

router.get("/", skillController.getCoachSkill)
router.post("/", skillController.createCoachSkill)
router.delete("/:id", skillController.deleteCoachSkill)

module.exports = router