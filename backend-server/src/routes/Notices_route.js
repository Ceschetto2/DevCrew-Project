/* 
Il file Bandi_route.js definisce le roots per gestire le richieste relative ai bandi.
- Utilizza Express per creare un router.
- Importa il modello Bando per interagire con il database.
- Rotte disponibili:
  - GET "/": recupera tutti i bandi dal database e li restituisce come risposta JSON.
  - POST "/": consente l'inserimento di nuovi bandi nel database utilizzando il metodo bulkCreate.
- Esporta il router per essere utilizzato nel server principale.
*/

const express  = require("express");

const router  = express.Router();


const notices_controller = require("../controllers/notices_controller/notices_controller");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const { upload } = require("./fileManagement");



router.get("/", notices_controller.getNotices);
router.post("/",tokenValidation, roleValidation(['president']), upload.fields([
{ name:'files', maxCount: 10 }]), notices_controller.sendNotices);
router.delete("/delete", tokenValidation, roleValidation(['president']), notices_controller.deleteNotices);

module.exports = router;