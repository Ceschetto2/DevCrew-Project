const express = require("express");
const router = express.Router();

const  societyController  = require("../controllers/society_controller/society_controller");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");

router.get("/getSocietyData", tokenValidation, roleValidation(['president']), societyController.getSocietyData)
router.post("/sendSocietyData", tokenValidation, roleValidation(['president']), societyController.sendSocietyData)
router.put("/updateSocietyData", tokenValidation, roleValidation(['president']), societyController.updateSocietyData)

module.exports = router;