const express = require("express");
const router = express.Router();

const weatherController = require("../controllers/weather_controller/weatherController");
const { tokenValidation } = require("../controllers/auth_controller/authController");

router.get("/", tokenValidation,  weatherController.getWeather);



module.exports = router;