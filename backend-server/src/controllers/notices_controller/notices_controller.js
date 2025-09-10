const { Notices, Pdfs, sequelize } = require("../../models");
const { Op } = require("sequelize");
const fs = require("fs");

exports.getNotices = async (req, res) => {

  const { data, date, isOrdGrow, n_obj } = req.query;
  let limit = null;
  if (n_obj) {
    limit = parseInt(n_obj)
  }
  let where = {}
  if (data) {
    where = {
      [Op.or]: [
        { title: { [Op.like]: `%${data}%` } },
        { body: { [Op.like]: `%${data}%` } },
        { object: { [Op.like]: `%${data}%` } },

      ]
    }
  }
  if (date) {
    const dayStart = new Date(date + 'Z'); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date + 'Z'); dayEnd.setHours(23, 59, 59, 999);
    where.createdAt = { [Op.between]: [dayStart, dayEnd] };
  }
  let order = null
  order = String(isOrdGrow).toLowerCase()
  if (order) {
    order = [['title', order === 'true' ? 'ASC' : 'DESC']]
  } else order = [['createdAt', 'ASC']]

  const results = await (
    Notices.findAll({
      include: [
        {
          model: Pdfs,
        },
      ],
      where,
      limit,
      order: [
        ['createdAt', 'DESC']
      ],
    })

  );

  return res.json(results);
};
exports.deleteNotices = async (req, res) => {
  try {
    const { notice_id } = req.query;

    // Elimina prima i PDF associati
    await Pdfs.findAll({ where: { notice_id: notice_id } }).then((pdfs) => {
      pdfs.forEach((pdf) =>{
        const file_to_delete = pdf.file_path.replace("files/pdfs", "uploads/pdfs")
        fs.unlink(file_to_delete, (err) => {
          if (err) {
            console.error("Errore eliminazione file:", err);
          }
        })
      });
    })
    await Pdfs.destroy({ where: { notice_id: notice_id } });

    // Poi elimina il bando
    const deleted = await Notices.destroy({ where: { notice_id } });

    if (deleted) {
      return res.json({ message: "Bando eliminato con successo" });
    } else {
      return res.status(404).json({ error: "Bando non trovato" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore interno", details: error.message });
  }
};


exports.sendNotices = async (req, res) => {
  const newItem = JSON.parse(req.body.newItem);
  console.log(newItem)

  const t = await sequelize.transaction();

  try {
    const { title, object, body } = newItem;
    if (!title) {
      return res.status(400).json({ error: "Il titolo è obbligatorio" });
    }
    if (!object) {
      return res.status(400).json({ error: "L'oggetto è obbligatorio" });
    }
    const pdfFiles = req.files?.files || []; // Recupera i file PDF, array vuoto se non presenti

    const notice = await Notices.create(
      {
        title: title,
        object: object,
        body: body || null,
      },
      { transaction: t }
    );

    //costruisco URL pubblici per i file caricati
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (pdfFiles.length) {
      const rows = pdfFiles.map((f, idx) => ({
        file_path: `files/pdfs/${f.filename}`,
        preview: false,
        file_url: `${baseUrl}/files/pdfs/${f.filename}`,
        notice_id: notice.notice_id,
      }));

      await Pdfs.bulkCreate(rows, { transaction: t });
    }
    await t.commit();

    console.log("test:", notice)
    await notice.reload({ include: [{ model: Pdfs }] });
    return res.status(201).json({
      message: "Bando inserito con successo",
      notice: notice
    });


  } catch (error) {
    await t.rollback();
    console.error(error);
    return res
      .status(500)
      .json({ error: "Errore interno", details: error.message });
  }
};


