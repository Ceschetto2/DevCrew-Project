/* 
Il file FAQ_routes.js definisce le roots per gestire le richieste relative alle domande frequenti (FAQ).
- Utilizza Express per creare un router.
- Importa il controller faqControllers per gestire la logica delle richieste.
- Rotte disponibili:
  - GET "/": recupera l'elenco delle FAQ utilizzando il metodo getFaqList del controller.
  - POST "/": consente l'inserimento di una nuova domanda FAQ utilizzando il metodo sendFaqQuestion del controller.
- Esporta il router per essere utilizzato nel server principale.
*/

const express = require("express");
const faqControllers = require("../controllers/faq_controllers/faqControllers");

const router = express.Router();



router.get("/", faqControllers.getFaqList);

router.post("/", faqControllers.sendFaqQuestion)

module.exports = router;