const express = require('express');
const { InternalRegulations, Pdfs, sequelize } = require("../../models");
const { Op } = require('sequelize');
const fs = require('fs');

exports.getRules = async (req, res) => {

  const { search_date, search_text, isOrdGrow, n_obj } = req.query
  let where = {}
  if (search_text) {
    where[Op.or] = {
      title: {
        [Op.like]: `%${search_text}%`,
      },
      object: {
        [Op.like]: `%${search_text}%`,
      },
      body: {
        [Op.like]: `%${search_text}%`,
      },
    }
  }
  if (search_date) {
    const dayStart = new Date(search_date + 'Z'); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(search_date + 'Z'); dayEnd.setHours(23, 59, 59, 999);
    where.createdAt = { [Op.between]: [dayStart, dayEnd] };
  }

  let limit = null;
  if (n_obj) {
    limit = parseInt(n_obj)
  }
  let order = null
  order = String(isOrdGrow).toLowerCase()
  if (order) {
    order = [['title', order === 'true' ? 'ASC' : 'DESC']]
  } else order = [['createdAt', 'ASC']]

  try {
    const response = await InternalRegulations.findAll({
      where,
      order,
      include: [
        {
          model: Pdfs,
        },
      ],
    })
    res.json(response);
  } catch (err) {
    res.status(500).json(err)
  }
}



exports.sendRule = async (req, res) => {
  const newRule = JSON.parse(req.body.newRule)
  console.log(newRule)
  const t = await sequelize.transaction();

  try {

    const { title, object, body } = newRule;
    console.log(title, object, body)
    if (!title) {
      return res.status(400).json({ error: "Il titolo è obbligatorio" });
    }
    if (!object) {
      return res.status(400).json({ error: "L'oggetto è obbligatorio" });
    }
    const pdfFiles = req.files?.files || []; // Recupera i file PDF, array vuoto se non presenti


    const rule = await InternalRegulations.create(
      {
        title: title,
        object: object,
        body: body || null,
        uploaded_by: req.user.user_id
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
        rule_id: rule.rule_id,
      }));

      await Pdfs.bulkCreate(rows, { transaction: t });
    }
    await t.commit();
    await rule.reload({ include: [{ model: Pdfs }] });
    return res.status(201).json({
      message: "Regolamentazione inserita con successo",
      rule: rule
    });

  } catch (error) {
    await t.rollback();
    console.error(error);
    return res
      .status(500)
      .json({ error: "Errore interno", details: error.message });
  }
};


exports.deleteRule = async (req, res) => {
  try {
    const rule_id = req.query.rule_id;
    await Pdfs.findAll({ where: { rule_id: rule_id } }).then((pdfs) => {
      pdfs.forEach((pdf) => {
        const file_to_delete = pdf.file_path.replace("files/pdfs", "uploads/pdfs")
        fs.unlink(file_to_delete, (err) => {
          if (err) {
            console.error("Errore eliminazione file:", err);
          }
        })
      });
    })
    // Elimina prima i PDF associati
    await Pdfs.destroy({ where: { rule_id: rule_id } });

    // Poi elimina il regolamento
    const deleted = await InternalRegulations.destroy({ where: { rule_id } });

    if (deleted) {
      return res.json({ message: "Regolamentazione eliminata con successo" });
    } else {
      return res.status(404).json({ error: "Regolamentazione non trovato" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore interno", details: error.message });
  }
};
