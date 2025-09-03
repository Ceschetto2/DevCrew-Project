/* 
Il file GalleryImages_routes.js definisce le roots per gestire le richieste relative alle immagini della galleria.
- Utilizza Express per creare un router.
- Importa il controller GalleryController per gestire la logica delle richieste.
- Rotte disponibili:
  - GET "/": recupera tutte le immagini utilizzando il metodo getImages del controller.
  - POST "/": consente l'inserimento di nuove immagini utilizzando il metodo sendImages del controller.
  - GET "/test": esegue la stessa funzione della rotta GET "/" per scopi di test o personalizzazione.
- Esporta il router per essere utilizzato nel server principale.
*/

const express = require("express");
const router = express.Router();
const GalleryController = require('../controllers/gallery_controllers/galleryController');
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const { upload } = require("./fileManagement");

//Nelle routes verranno inserite tutte le rotte riguardanti una determinata componente
router.get("/", GalleryController.getImages);
router.post("/", tokenValidation, roleValidation(['president']), upload.fields([{ name: "files", maxCount: 10 }, { name: "imgs", maxCount: 10 }]), GalleryController.sendImages);
//Possiamo anche specializzare la route per legarla a diverse funzioni o query. In questo caso questa routes fa la stessa cosa della prima
router.delete("/", tokenValidation, roleValidation(['president']), GalleryController.deleteImage);
module.exports = router;
