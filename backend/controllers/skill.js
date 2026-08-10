const { dataSource } = require("../db/data-source")
const skillRepo = dataSource.getRepository("Skill")
const { isUUID } = require("class-validator")
const errorHandler = require("../utils/errorHandler")

const getCoachSkill = async (req, res, next) => {
  try {
    const skills = await skillRepo.find({
      select:{
        id: true,
        name: true
      }
    })
    res.status(200).json({
      status: "success",
      data:skills
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const createCoachSkill = async(req, res, next) => {
  try {
    const { name } = req.body
    if(!name) {
      return next(errorHandler(400, "欄位未填寫正確"))
    }

    const existSkill = await skillRepo.existsBy({ name })
    if(existSkill){
      return next(errorHandler(409, "資料重複"))
    }

    const newSkill = await skillRepo.create({name})
    const result = await skillRepo.save(newSkill)
    res.status(200).json({ status: "success", data: result })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteCoachSkill = async(req, res, next) => {
  try {
    const { id } = req.params
    if(!(isUUID(id))){
      return next(errorHandler(400, "錯誤的id資訊"))
    }

    const result = await skillRepo.delete(id)
    if(result.affected === 0){
      return next(errorHandler(400, "查無資料"))
    }

    res.status(200).json({
      status: "success",
      data: { raw: result.raw, affected: result.affected}
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = {
  getCoachSkill,
  createCoachSkill,
  deleteCoachSkill
}