const { dataSource } = require("../db/data-source")
const coachRepo = dataSource.getRepository("Coach")
const errorHandler = require("../utils/errorHandler")

const isCoachAuth = async(req, res, next) => {
  const { id } = req.user

  if(req.user.role === "USER") {
    return next(errorHandler(400, "使用者尚未成為教練"));
  }

  const targetCoach = await coachRepo.findOne({where: {user:{id}}})

  if (!targetCoach) {
    return next(errorHandler(400, "使用者尚未成為教練"));
  }

  req.coach = targetCoach

  next()
}

module.exports = isCoachAuth