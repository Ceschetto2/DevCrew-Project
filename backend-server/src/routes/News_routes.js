/* 
Il file Notizie_routes.js definisce le roots per gestire le richieste relative alle notizie.
- Utilizza Express per creare un router.
- Importa il controller NotizieController per gestire la logica delle richieste.
- Rotte disponibili:
  - GET "/": recupera tutte le notizie utilizzando il metodo getNotizie del controller.
  - POST "/": consente l'inserimento di nuove notizie utilizzando il metodo sendNotizie del controller.
- Esporta il router per essere utilizzato nel server principale.
*/

const express = require("express");
const  newsController  = require("../controllers/news_controllers/newsController");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const { upload } = require("./fileManagement");

const router = express.Router();


router.get("/", newsController.getNews)
router.post("/", tokenValidation, roleValidation(['president']), upload.fields([
  { name: "files", maxCount: 0 },
    { name: "imgs", maxCount: 1 }
]), newsController.sendNews)
router.delete("/delete", tokenValidation, roleValidation(['president']), newsController.deleteNews);

module.exports = router;