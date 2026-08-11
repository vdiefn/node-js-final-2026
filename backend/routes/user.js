const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken")

router.post("/signup", userController.userSignUp);
router.post("/login", userController.userLogin);
router.get("/profile", verifyToken, userController.getUserProfile);
router.put("/profile", verifyToken, userController.updateUserName);
router.put("/password", verifyToken, userController.updateUserPassword);

module.exports = router;
