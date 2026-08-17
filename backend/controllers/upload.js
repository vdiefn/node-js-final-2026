const errorHandler = require("../utils/errorHandler")
const fileHelper = require("../utils/fileHelper")

const handleUpload = async (req, res, next) => {
  const file = req.file
  if(!file){
    return next(errorHandler(400, "請選擇要上傳的圖片"))
  }

  const result = await fileHelper(req.file.buffer);

  res.status(200).json({status:"success", data: { image_url: result.secure_url}})

}

module.exports = {
  handleUpload
}