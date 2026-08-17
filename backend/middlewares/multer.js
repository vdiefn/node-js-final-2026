const multer = require("multer")

const upload = multer({
  storage:multer.memoryStorage(),
  limits: {
    fileSize: 2*1024*1024
  },
  fileFilter: (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
      cb(null, true)
    } else {
      cb(new Error("只支援 JPG 或 PNG 格式圖片"), false)
    }
  }
})

module.exports = upload