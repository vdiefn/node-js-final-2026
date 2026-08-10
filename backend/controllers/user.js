const { dataSource } = require("../db/data-source")
const userRepo = dataSource.getRepository("User")
const errorHandler = require("../utils/errorHandler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function hasUpperCase(s){
  const regex = /[A-Z]/
  return regex.test(s)
}

function hasLowerCase(s){
  const regex = /[a-z]/
  return regex.test(s)
}

function hasDigit(s){
  const regex = /[\d]/
  return regex.test(s)
}

function validLength(s){
  return typeof s === "string" && s.length >= 8 && s.length <= 16;
}

function checkPassword(password){
  return hasUpperCase(password) && hasLowerCase(password) && hasDigit(password) && validLength(password)
}

const userSignUp = async(req, res, next) => {
  try {
    const { name, email, password } = req.body

    const requireFields = ["name", "email", "password"]
    const missingFields = requireFields.filter(item => !req.body[item])
    if(missingFields.length > 0){
      return next(errorHandler(400, "欄位未填寫正確"))
    }

    const isValidPassword = checkPassword(password)
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
  } catch (error) {
    console.error(error)
    next(error)
  }
}

function isValidString(s){
  return s.trim().length > 0
}

const userLogin = async(req, res, next) => {
    const { email, password } = req.body
    if (!isValidString(email) || !isValidString(password)) {
      return next(errorHandler(400, "欄位未填寫正確"));
    }

    if(!hasUpperCase(password)|| !hasLowerCase(password) || !hasDigit(password) || !validLength(password)){
      return next(errorHandler(400, "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"));
    }

  try {
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
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getUserProfile = async(req, res, next) => {
  try {
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
  } catch (error) {
    console.error(error)
    next(error)
  }

}

const updateUserName = async(req, res, next) => {

}

const updateUserPassword = async(req, res, next) => {

}

module.exports = {
  userSignUp,
  userLogin,
  getUserProfile,
  updateUserName,
  updateUserPassword
}