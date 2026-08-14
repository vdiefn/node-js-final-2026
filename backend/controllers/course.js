const { dataSource } = require("../db/data-source")
const errorHandler = require("../utils/errorHandler")
const courseRepo = dataSource.getRepository("Course")
const { MoreThanOrEqual, LessThanOrEqual } = require("typeorm")

const getCourses = async(req, res, next) => {
  const courseData = await courseRepo.find({
    where: {
      start_at: LessThanOrEqual(new Date()),
      end_at: MoreThanOrEqual(new Date())
    },
    relations: { coach: {user: true}, skill: true}
  })

  const data = courseData.map(item => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      start_at: item.start_at,
      end_at: item.end_at,
      max_participants: item.max_participants,
      coach_name: item.coach.user.name,
      skill_name: item.skill.name
    }
  })

  res.status(200).json({status:"success", data})
}

module.exports = {
  getCourses
}