const { dataSource } = require("../db/data-source")
const errorHandler = require("../utils/errorHandler")
const validation = require("../utils/validation")
const coachRepo = dataSource.getRepository("Coach")
const userRepo = dataSource.getRepository("User")
const coachSkillRepo = dataSource.getRepository("CoachSkill")

const createCoach = async(req, res, next) => {
  const { userId } = req.params
  const { experience_years, description, profile_image_url } = req.body
  if(!userId || typeof userId !== "string" || userId.trim().length === 0){
    return next(errorHandler(400, "id不正確"))
  }

  if(!validation.isValidNumber(experience_years) || !validation.isValidString(description)){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  if(validation.isValidString(profile_image_url) && !validation.isValidUrl(profile_image_url)){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const target = await userRepo.findOne({where: {id:userId}})
  if(!target){
    return next(errorHandler(400, "userId 查無此使用者"))
  }

  if(target.role === "COACH"){
    return next(errorHandler(409, "使用者已經是教練"))
  }

  await userRepo.update({ id:userId }, { role:"COACH" })

  const newCoach = coachRepo.create({
    user: { id : userId },
    experience_years,
    description: description.trim(),
    profile_image_url:profile_image_url? profile_image_url.trim(): null
  })
  const savedCoach = await coachRepo.save(newCoach)

  const { user, ...coachDate } = newCoach

  res.status(201).json({
    status:"success",
    data: {
      user: {
        name: target.name,
        role: "COACH"
      },
      coach: {
        id: savedCoach.id,
        user_id: userId,
        experience_years: savedCoach.experience_years,
        description: savedCoach.description,
        profile_image_url: savedCoach.profile_image_url,
        created_at: savedCoach.created_at,
        updated_at: savedCoach.updated_at
      }
    }
  })
}

const getCoach = async(req, res, next) => {
  const userId = req.user.id
  const targetCoach = await coachRepo.findOne({where: {user:{id: userId}}})

  const coachSkills = await coachSkillRepo.find({
    where: {coach: {id: targetCoach.id}},
    relations: { skill: true}
  })

  const skill_ids = coachSkills.map(item => item.skill.id)

  res.status(200).json({
    status:"success",
    data: {
      id: targetCoach.id,
      experience_years: targetCoach.experience_years,
      description: targetCoach.description,
      profile_image_url: targetCoach.profile_image_url,
      skill_ids
    }
  })
}

const updateCoach = async(req, res, next) => {
  const { id } = req.user
  const { experience_years, description, profile_image_url, skill_ids } = req.body

  if(!validation.isValidNumber(experience_years) || !validation.isValidString(description) || !validation.isValidSkill(skill_ids)){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  if(!profile_image_url || !validation.isValidUrl(profile_image_url)){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const targetUser = await userRepo.findOne({where:{id}})
  if(!targetUser || targetUser.role !== "COACH"){
    return next(errorHandler(401, "使用者尚未成為教練"))
  }

  const targetCoach = await coachRepo.findOne({where: {user: {id}}})
  if(!targetCoach){
    return next(errorHandler(400, "找不到教練資料"))
  }

  await coachRepo.update(targetCoach.id, {
    experience_years,
    description: description.trim(),
    profile_image_url: profile_image_url.trim(),
  })

  await coachSkillRepo.delete( { coach: {id: targetCoach.id}})

  const newSkill = await skill_ids.map(skillId => {
    return coachSkillRepo.create({
      coach: {id: targetCoach.id},
      skill: {id: skillId}
    })
  })

  await coachSkillRepo.save(newSkill)

  res.status(200).json({
    status: "success",
    data: {
      id: targetCoach.id,
      experience_years,
      description,
      profile_image_url,
      skill_ids
    }
  })

}

const getCoachCourse = async(req, res, next) => {
  const coachId = req.coach.id
  const skills = await coachSkillRepo.find({
    where: {coach_id: coachId},
    relations: {skill: true}
  })
}

const createCourse = async(req, res, next) => {

}

const getCourseDetail = async(req, res, next) => {

}

const updateCourseDetail = async(req, res, next) => {

}


module.exports = {
  createCoach,
  getCoach,
  updateCoach,
  getCoachCourse,
  createCourse,
  getCourseDetail,
  updateCourseDetail
}