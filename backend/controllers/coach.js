const { dataSource } = require("../db/data-source")
const skillRepo = dataSource.getRepository("Skill")
const { isUUID } = require("class-validator")

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
      res.status(400).json({ status: "failed", message:"欄位未填寫正確"})
      return
    }

    const existSkill = await skillRepo.find({ where: { name }})
    if(existSkill.length > 0){
      res.status(409).json({ status: "failed", message:"資料重複"})
      return
    }
    const newSkill = await skillRepo.create({name})
    const result = await skillRepo.save(newSkill)
    res.status(200).json({ status: "success", data: result })
  } catch (error) {

  }
}

const deleteCoachSkill = async(req, res, next) => {
  try {
    const { id } = req.params
    if(!(isUUID(id))){
      res.status(400).json({ status: "failed", message:"錯誤的id資訊"})
      return
    }

    const result = await skillRepo.delete(id)
    if(result.affected === 0){
      res.status(400).json({ status: "failed", message: "查無資料"})
      return
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