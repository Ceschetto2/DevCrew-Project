
const express  = require("express");

const router  = express.Router();
const aichat_controller = require("../controllers/aichat_controller/aichat_controller");


router.post("/",aichat_controller.sendMessage);

module.exports = router;