const { dataSource } = require("../db/data-source")
const errorHandler = require("../utils/errorHandler")
const validation = require("../utils/validation")
const coachRepo = dataSource.getRepository("Coach")
const coachSkillRepo = dataSource.getRepository("CoachSkill")
const { isUUID } = require("class-validator")

const getCoaches = async(req, res, next) => {
  const { per, page } = req.query

  if(!validation.isValidString(per) || !validation.isValidNumber(Number(per))){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  if(!validation.isValidString(page) && !validation.isValidNumber(Number(page))){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const skip = per * (page-1)

  const coaches = await coachRepo.find({
    select: {
      id: true,
      user: {
        id: true,
        name: true
      }
    },
    relations: { user: true},
    take: per,
    skip
  })

  const coachData = coaches.map(item => ({
    id: item.id,
    user_id: item.user.id,
    name: item.user.name
  }))

  res.status(200).json({status: "success", data: coachData})
}

const getCoachDetail = async(req, res, next) => {
  const { coachId } = req.params

  if(!isUUID(coachId)){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const targetCoach = await coachRepo.findOne({
    where: {id: coachId},
    relations: {user: true,}
  })

  if(!targetCoach){
    return next(errorHandler(400, "找不到該教練"))
  }

  const coachSkills = await coachSkillRepo.find({
    where: { coach: { id: coachId}},
    relations: { skill: true}
  })

  const skillData = coachSkills.map(item=>item.skill.name)

  const coachData = {
    user: {
      name: targetCoach.user.name,
      role: targetCoach.user.role
    },
    coach: {
      id:targetCoach.id,
      user_id: targetCoach.user_id,
      experience_years: targetCoach.experience_years,
      description: targetCoach.description,
      profile_image_url: targetCoach.profile_image_url,
      created_at: targetCoach.created_at,
      updated_at: targetCoach.updated_at,
      skills: skillData
    }
  }
  res.status(200).json({status:"success", data:coachData})
}

const getOneCoachCourse = (req, res, next) => {

}

module.exports = {
  getCoaches,
  getCoachDetail,
  getOneCoachCourse
}