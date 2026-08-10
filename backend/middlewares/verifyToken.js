const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/errorHandler")

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return next(errorHandler(401, "請先登入"))
  }

  const token = authHeader.split(" ")[1]
  const SECRET = process.env.JWT_SECRET
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if(error.name === "TokenExpiredError"){
      return next(errorHandler(401, "token已過期"))
    } else if(error.name === "JsonWebTokenError"){
      return next(errorHandler(401, "token 無效"))
    } else {
      return next(errorHandler(401, "身份驗證失敗"))
    }
  }
}

module.exports =verifyToken