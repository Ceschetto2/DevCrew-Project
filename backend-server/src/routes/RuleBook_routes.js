/* 
Il file Regolamento_routes.js definisce le roots per gestire le richieste relative al regolamento.
- Utilizza Express per creare un router.
- Importa il modello Regola per interagire con il database.
- Rotte disponibili:
  - GET "/": recupera tutte le regole dal database e le restituisce come risposta JSON.
  - POST "/": consente l'inserimento di più regole nel database utilizzando il metodo bulkCreate.
- Esporta il router per essere utilizzato nel server principale.
*/

const express = require("express");

const  RuleBookController  = require("../controllers/ruleBook_controller/ruleBook_controller");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const { upload } = require("./fileManagement");

const router = express.Router();

router.get("/", RuleBookController.getRules);
router.post("/",tokenValidation, roleValidation(['president']),  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "imgs", maxCount: 10 },
  ]), RuleBookController.sendRule);




router.delete("/",tokenValidation, roleValidation(['president']), RuleBookController.deleteRule);
module.exports = router;