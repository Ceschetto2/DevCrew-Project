/* 
Il file faqControllers.js definisce i metodi per gestire le operazioni relative alle domande frequenti (FAQ) nel database.
- Metodi definiti:
  - getFaqList: recupera tutte le FAQ dal database. Se viene fornito un parametro di ricerca (data), esegue una query per trovare domande che corrispondono al parametro.
  - sendFaqQuestion: consente l'inserimento di nuove domande FAQ nel database utilizzando il metodo bulkCreate.
- Utilizza il modello FaqQuestion e l'istanza Sequelize per interagire con il database.
- Restituisce i risultati delle operazioni come risposta JSON.
*/

const { Op } = require("sequelize");
const { FaqQuestions, sequelize } = require("../../models");

/* 
  Recupera le domande frequenti (FAQ) dal database.
  - Se non viene fornito alcun parametro di query, restituisce tutte le FAQ.
  - Se viene fornito un parametro `data` (via query string), esegue una query per cercare
    domande il cui testo corrisponde al parametro.
*/

exports.getFaqList = async (req, res) => {
  const  {text, date, isOrdGrow}  = req.query;
  const grow = String(isOrdGrow).toLowerCase() === 'true';

  console.log("test",isOrdGrow)
  let order = null

  if(grow){
    order = [['createdAt', 'ASC']]
  }else{
    order = [['createdAt', 'DESC']]
  }
  console.log(isOrdGrow, order)
  
  let where = {}
  if(text){
    where[Op.or] = [
      {question:{ [Op.like]: `%${text}%` }},
      {answare: {[Op.like]: `%${text}%` }}
    ]
    }

  
  
   const results = await FaqQuestions.findAll({where, order})
    
  res.json(results);
};

/* 
  Inserisce nuove domande FAQ nel database.
  - Si aspetta un array di oggetti nel body della richiesta contenente i dati delle domande FAQ.
  - Utilizza il metodo `bulkCreate` di Sequelize per effettuare l'inserimento multiplo.
  - In caso di successo, restituisce un messaggio di conferma.
*/

exports.sendFaqQuestion = async(req,res) => {
    const qa = req.body
    FaqQuestions.bulkCreate(qa)
    res.json("Inserimento avvenuto")


}
