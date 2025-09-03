/* 
Il file notizieController.js definisce i metodi per gestire le operazioni relative alle notizie nel database.
- Metodi definiti:
  - getNotizie: recupera tutte le notizie dal database. Se viene fornito un parametro di ricerca (data), esegue una query per trovare notizie il cui titolo o oggetto corrisponde al parametro.
  - sendNotizie: consente l'inserimento di nuove notizie nel database utilizzando il metodo bulkCreate.
- Utilizza il modello Notizia e l'istanza Sequelize per interagire con il database.
- Restituisce i risultati delle operazioni come risposta JSON.
*/

const { Op } = require("sequelize");
const { News, sequelize } = require("../../models")

/* 
  Recupera le notizie dal database.
  - Se non viene fornito alcun parametro di query, restituisce tutte le notizie.
  - Se viene fornito un parametro `data` (via query string), esegue una query per cercare
    notizie il cui titolo o oggetto contengano il valore specificato.
*/

exports.getNews = async (req, res) => {
    const { data, date, isOrdGrow, n_obj } = req.query

    let limit = null;
    if (n_obj) {
        limit = parseInt(n_obj)
    }

    let where = {}
    if (data) {
        where = {
            [Op.or]: [
                { title: { [Op.like]: `%${data}%` } },
                { object: { [Op.like]: `%${data}%` } }
            ]
        }
    }
  let order = null
  order = String(isOrdGrow).toLowerCase()
  if (order) {
    order = [['title', order === 'true' ? 'ASC' : 'DESC']]
  }else order = [['createdAt', 'ASC']]
    if (date) {
        const dayStart = new Date(date + 'Z'); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date + 'Z'); dayEnd.setHours(23, 59, 59, 999);
        where.createdAt = { [Op.between]: [dayStart, dayEnd] };
    }
    

    try {
        const results = await News.findAll({ where, limit, order });

        res.json(results)
    }
    catch (error) {
        res.status(500).json({ error: "Errore nel recupero delle notizie" });
    }

}

/* 
  Inserisce nuove notizie nel database.
  - Si aspetta un array di oggetti nel body della richiesta contenente i dati delle notizie.
  - Utilizza il metodo `bulkCreate` di Sequelize per effettuare l'inserimento multiplo.
  - In caso di successo, restituisce un messaggio di conferma.
*/

exports.sendNews = async (req, res) => {
    const notiz = JSON.parse(req.body.newItem)
    const { title, body, object } = notiz;
    if (!title) {
        return res.status(400).json({ error: "Il titolo della notizia non puo essere vuoto" });
    }
    if (!body) {
        return res.status(400).json({ error: "Il corpo della notizia non puo essere vuoto" });
    }
    if (!object) {
        return res.status(400).json({ error: "L'oggetto della notizia non puo essere vuoto" });
    }

    const img = req.files?.imgs[0] || null;
    let img_url = null
    if (img) {
        img_url = `${req.protocol}://${req.get("host")}/files/images/${img.filename}`
    }



    try {
        const news = await News.create({ title: title, description: body, object: object, img_url: img_url, uploaded_by: req.user.user_id })
        return res.json({ msg: "Inserimento avvenuto con successo", news: news })
    }
    catch (error) {
        console.error("Error creating news:", error);
        return res.status(500).json({ error: error, message: "Failed to create news" });
    }


}


exports.deleteNews = async (req, res) => {
    news_id = req.query.news_id
    if (!news_id) {
        return res.status(404).json({ error: "L'id della notizia non puo essere vuoto" });
    }
    try {
        await News.destroy({ where: { news_id: news_id } })
    }
    catch (error) {
        console.error("Error deleting news:", error);
        return res.status(500).json({ error: error, message: "Failed to delete news" });
    }
    return res.json({ msg: "Rimozione avvenuta con successo" })
}