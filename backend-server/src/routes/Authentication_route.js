const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller/authController");


router.post("/login", authController.login);

module.exports = router;
