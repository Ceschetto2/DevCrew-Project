const express = require("express");
const router = express.Router();

const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const userController = require("../controllers/user_controller/userController");


router.post("/addNewUser", tokenValidation, roleValidation(['president']), userController.addNewUser);
router.post("/forceAddNewUser", userController.addNewUser); //permette di aggiungere un nuovo utente senza token

router.get("/getUserFromToken", tokenValidation,roleValidation(['athlete','president', 'trainer']), userController.getUserFromToken )

router.get("/getUserEventParticipations", tokenValidation, roleValidation(['president', 'trainer']), userController.getUserEventParticipations)
router.get("/getAllUsers", tokenValidation, roleValidation(['president', 'trainer']), userController.getUsers)
router.post("/deleteUser", tokenValidation, roleValidation(['president']), userController.deleteUser)
router.get('/getUsersEventParticipations', tokenValidation, roleValidation(['president', 'trainer']), userController.getUsersEventParticipations)
router.get("/getUsersFiltered", tokenValidation, roleValidation(['president', 'trainer']), userController.getUsersFiltered)
router.get("/getContactsFiltered", tokenValidation, roleValidation(['athlete','president', 'trainer']), userController.getContactsFiltered)

router.put("/updateUser", tokenValidation, roleValidation(['athlete','president', 'trainer']), userController.updateUser)

router.put("/updatePassword", tokenValidation, roleValidation(['athlete','president', 'trainer']), userController.updatePassword)
router.get("/getRoleByToken", tokenValidation, roleValidation(['athlete','president', 'trainer']), userController.getRoleByToken)
module.exports = router;
