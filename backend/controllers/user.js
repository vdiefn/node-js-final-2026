const { dataSource } = require("../db/data-source")
const userRepo = dataSource.getRepository("user")

const userSignUp = async(req, res, next) => {

}

const userLogin = async(req, res, next) => {

}

const getUserProfile = async(req, res, next) => {

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