function errorHandler(code, message){
  const error = new Error(message)
  error.statusCode = code
  error.isOperational = true
  return error
}

module.exports = errorHandler