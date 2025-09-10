/* 
Il file galleryController.js definisce i metodi per gestire le operazioni relative alle immagini della galleria nel database.
- Metodi definiti:
  - getImages: recupera tutte le immagini dal database. Se viene fornito un parametro di ricerca (data), esegue una query per trovare immagini il cui titolo o informazioni corrispondono al parametro.
  - sendImages: consente l'inserimento di nuove immagini nel database utilizzando il metodo bulkCreate.
- Utilizza il modello GalleryImage e l'istanza Sequelize per interagire con il database.
- Restituisce i risultati delle operazioni come risposta JSON.
*/

const { Op } = require("sequelize");
const { GalleryImages } = require("../../models");
const fs = require("fs");

/*
  Recupera le immagini dalla galleria.
  - Se non viene fornito alcun parametro di query, restituisce tutte le immagini.
  - Se viene fornito un parametro `data` (via query string), esegue una query per cercare
    immagini il cui titolo o campo "informations" contengano il valore specificato.
  - Per semplicità si utilizza una query GET con parametri URL.
  - In alternativa, per maggiore sicurezza, si potrebbe usare una POST con i parametri nel body.
*/

exports.getImages = async (req, res) => {

  const { data, isOrdGrow, n_obj, date } = req.query

  let limit = null;
  if (n_obj) {
    limit = parseInt(n_obj)
  }

  let where = {}
  if (data) {
    where = {
      [Op.or]: [
        { title: { [Op.like]: `%${data}%` } },
        { informations: { [Op.like]: `%${data}%` } },
      ]
    }
  }
  let order = null
  order = String(isOrdGrow).toLowerCase()
  if (order) {
    order = [['title', order === 'true' ? 'ASC' : 'DESC']]
  } else order = [['createdAt', 'ASC']]

  if (date) {
    const dayStart = new Date(date + 'Z'); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date + 'Z'); dayEnd.setHours(23, 59, 59, 999);
    where.createdAt = { [Op.between]: [dayStart, dayEnd] };
  }

  try {
    const listOfImages = await GalleryImages.findAll({ where, order, limit });

    res.json(listOfImages);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle immagini" });
  }

};

/*
Inserisce nuove immagini nel database.
- Si aspetta un array di oggetti nel body della richiesta contenente i dati delle immagini.
- Utilizza il metodo `bulkCreate` di Sequelize per effettuare l'inserimento multiplo.
- In caso di successo, restituisce un messaggio di conferma.
*/

exports.sendImages = async (req, res) => {
  const imgsData_raw = JSON.parse(req.body.newImgData);
  const imgData = {
    title: imgsData_raw.title,
    informations: imgsData_raw.body,
    uploaded_by: req.user.user_id,
  };
  if (!imgData.title) {
    return res.status(400).json({ error: "Il titolo e l'immagine non possono essere vuoti" });
  }
  const imgs = req.files?.imgs || [];
  if (imgs.lenght === 0) {
    return res.status(400).json({ error: "Devi inserire almeno una immagine" });
  }
  const imgsToAdd = [];


  imgs.forEach(img => {
    imgsToAdd.push({
      title: imgData.title,
      informations: imgData.informations,
      img_url: `${req.protocol}://${req.get("host")}/files/images/${img.filename}`,
    });
  });
  try {
    const addedImgs = await GalleryImages.bulkCreate(imgsToAdd);
    res.json({ addedImgs: addedImgs, msg: "Inserimento avvenuto con successo" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err: err, message: "Error. Could not save the data" })
  }
}



exports.deleteImage = async (req, res) => {
  console.log(req.query)
  const img_id = req.query.img_id
  if (!img_id) {
    return res.status(404).json({ error: "L'id dell'immagine non puo essere vuoto" });
  }


  try {
    const imgs = await GalleryImages.findAll({ where: { img_id: img_id } })
    if (imgs.lenght === 0) {
      return res.status(404).json({ error: "Immagine non trovata" });
    }
    const img = imgs[0]
    const img_to_delete = img.img_url.replace(/^.*?\/files\//, "uploads/")


    await img.destroy()

    fs.unlinkSync(img_to_delete)

    return res.json({ msg: "Rimozione avvenuta con successo" })

  }
  catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: error, message: "Failed to delete image" });
  }

}