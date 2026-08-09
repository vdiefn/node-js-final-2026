const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.userSignUp);
router.post("/login", userController.userLogin);
router.get("/profile", userController.getUserProfile);
router.put("profile", userController.updateUserName);
router.put("/password", userController.updateUserPassword);

module.exports = router;
