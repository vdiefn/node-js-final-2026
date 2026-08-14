const { dataSource } = require("../db/data-source")
const userRepo = dataSource.getRepository("User")
const errorHandler = require("../utils/errorHandler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validation = require("../utils/validation")

const userSignUp = async(req, res, next) => {
  const { name, email, password } = req.body

  const requireFields = ["name", "email", "password"]
  const missingFields = requireFields.filter(item => !req.body[item])
  if(missingFields.length > 0){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const isValidPassword = validation.checkPassword(password)
  if(!isValidPassword){
    return next(errorHandler(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"))
  }

  const hasEmail = await userRepo.existsBy({ email})
  if(hasEmail){
    return next(errorHandler(409, "Email 已被使用"))
  }

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password.trim(), salt)
  const newUser = userRepo.create({name:name.trim(), email:email.trim(), password:hashPassword})
  const result = await userRepo.save(newUser)
  res.status(201).json({ status:"success", data: { user: { id: result.id, name:result.name }}})

}

const userLogin = async(req, res, next) => {
  const { email, password } = req.body
  if (!validation.isValidString(email) || !validation.isValidString(password)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if(!validation.checkPassword(password)){
    return next(errorHandler(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"));
  }


  const target = await userRepo.findOne({where: {email:email.trim()}})
  if(!target){
    return next(errorHandler(400, "使用者不存在或密碼輸入錯誤"));
  }

  const isMatch = await bcrypt.compare(password, target.password)
  if(!isMatch){
    return next(errorHandler(400, "使用者不存在或密碼輸入錯誤"));
  }

  const SECRET = process.env.JWT_SECRET
  const token = jwt.sign(
    {
      id: target.id,
      role: target.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_DAY
    }
  )

  res.status(201).json({
    status:"success",
    data: {
      token: token,
      user: {
        name: target.name,
      }
    }
  })
}

const getUserProfile = async(req, res, next) => {
  const target = await userRepo.findOne({ where: { id: req.user.id}})

  res.status(200).json({
    status:"success",
    data: {
      user: {
        name: target.name,
        email: target.email
      }
    }
  })
}

const updateUserName = async(req, res, next) => {
  const { name } = req.body
  if(!name || name.trim().length === 0 || typeof name !== "string"){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const newName = name.trim()

  try {
    const target = await userRepo.findOne({where:{id: req.user.id}})
    if(target.name === newName){
      return next(errorHandler(400, "使用者名稱未變更"))
    }

    const result = await userRepo.update(
      { id: req.user.id },
      { name: newName }
    )
    if(result.affected === 0){
      return next(errorHandler(400, "更新使用者資料失敗"))
    }
    res.status(200).json({ status:"success", data: { user: { name: newName }}})
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const updateUserPassword = async(req, res, next) => {
  const { password, new_password, confirm_new_password } = req.body

  const isValidPassword = validation.checkPassword(password) && validation.isValidString(password)
  const isValidNewPassword = validation.checkPassword(new_password) && validation.isValidString(new_password)
  const isValidConfirmNewPassword = validation.checkPassword(confirm_new_password) && validation.isValidString(confirm_new_password)

  if(!isValidPassword || !isValidNewPassword || !isValidConfirmNewPassword){
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  if(new_password.trim() !== confirm_new_password.trim()){
    return next(errorHandler(400, "新密碼與驗證新密碼不一致"))
  }

  const target = await userRepo.findOne({where:{id:req.user.id}})
  if (!target) {
    return next(errorHandler(404, "使用者不存在"));
  }

  const isMatch = await bcrypt.compare(password, target.password)
  if(!isMatch){
    return next(errorHandler(400, "密碼輸入錯誤"))
  }

  const isSamePassword = await bcrypt.compare(new_password.trim(), target.password)
  if(isSamePassword){
    return next(errorHandler(400, "新密碼不能與舊密碼相同"))
  }

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(new_password.trim(), salt)

  const result = await userRepo.update(
    {id: req.user.id},
    {password: hashPassword}
  )

  if(result.affected === 0){
    return next(errorHandler(400, "更新使用者資料失敗"))
  }

  res.status(200).json({status:"success", data:null})
}

const getUserCreditPackage = async(req, res, next) => {

}

const getUserCourses = async(req, res, next) => {

}

module.exports = {
  userSignUp,
  userLogin,
  getUserProfile,
  updateUserName,
  updateUserPassword,
  getUserCreditPackage,
  getUserCourses
}