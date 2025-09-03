const express= require("express");
const router=express.Router();
const AnnounceController = require("../controllers/Announce_controller/AnnounceController");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");



router.post("/",tokenValidation, roleValidation(['president', 'trainer']),AnnounceController.sendAvviso);
router.get("/",tokenValidation, roleValidation([]), AnnounceController.getAvviso);
router.delete("/delete",tokenValidation, roleValidation(['president','trainer']), AnnounceController.deleteAvviso);

module.exports=router;
