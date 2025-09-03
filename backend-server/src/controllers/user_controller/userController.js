
const bcrypt = require("bcryptjs");
const { Users } = require("../../models");

const { Op } = require("sequelize");
const transporter = require("../mailer");



/**
 * Aggiunge un nuovo utente al database con una password generata casualmente.
 * La password viene hashata prima di essere salvata.
 * Invia una email al nuovo utente con la password generata.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Oggetto request di Express contenente i dati dell'utente nel body.
 * @param {import('express').Response} res - Oggetto response di Express usato per inviare la risposta.
 * @returns {Promise<void>} Risponde con un messaggio di successo o fallimento.
 */
exports.addNewUser = async (req, res) => {
  const psswd = Math.random().toString(36).slice(-8);
  const userData = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(psswd, salt);
    userData.password = hash;
    await Users.create(userData);
  } catch (err) {
    return res.status(405).json("Errore durante l'inserimento dell'utente " + err.toString());
  }

  const info = transporter.sendMail({
    from: '"Associazione Vogatori Ostuni", rms072296@gmail.com',
    to: userData.mail,
    subject: "Test",
    text: "Ciao questa è la tua password " + psswd,
  });
  return res.json("Utente Inserito");
};

/**
 * Recupera le informazioni dell'utente dal token di autenticazione.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Oggetto request di Express contenente l'utente autenticato.
 * @param {import('express').Response} res - Oggetto response di Express usato per inviare i dati dell'utente.
 * @returns {Promise<void>} Risponde con le informazioni dell'utente.
 */
exports.getUserFromToken = async (req, res) => {

  res.json(req.user);
};

exports.getUserEventParticipations = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.user_id)
    const events = await user.getJoinedEvents();

    res.status(201).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
exports.getUsersEventParticipations = async (req, res) => {
  try {
    const user = await Users.findByPk(req.query.user_id)
    const events = await user.getJoinedEvents();

    res.status(201).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


exports.deleteUser = async (req, res) => {

  const user_to_delete = req.body
  try {
    const user = await Users.findByPk(user_to_delete.user_id)

    if (!user) {
      return res.status(404).json("Error: User Not Found")
    }

    await user.destroy()

    res.json("User deleted.")
  } catch (err) {
    return res.status(500).json({ Error: err, message: "Could not delete the resource selected" })

  }

}

exports.getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: ['user_id', 'username', 'name', 'surname', 'birthDate', 'mail', 'role'] })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err, message: "Could not retrive the information." })
  }
}

exports.getUsersFiltered = async (req, res) => {
  const text = req.query.text

  const date = req.query.date

  const where = {}
  if (text) {
    where[Op.or] = [
      { name: { [Op.like]: `%${text}%` } },
      { surname: { [Op.like]: `%${text}%` } },
      { role: { [Op.like]: `%${text}%` } }
    ]
  }
  const d = date ? new Date(date) : null;
  if (d && !isNaN(d)) {
    const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
    where.birthDate = { [Op.between]: [dayStart, dayEnd] };
  }

  try {
    const users = await Users.findAll(
      {
        attributes: ['user_id', 'username', 'name', 'surname', 'birthDate', 'mail', 'role'],
        where
      })
    res.json(users)

  } catch (err) {
    return res.status(500).json({ error: err, message: "Can't retrive the user data" })
  }
}

exports.getContactsFiltered = async (req, res) => {
  const text = req.query.text

  const date = req.query.date

  const where = {}
  where.role = { [Op.in]: ['president', 'trainer'] }
  if (text) {
    where[Op.or] = [
      { name: { [Op.like]: `%${text}%` } },
      { surname: { [Op.like]: `%${text}%` } },
    ]
  }
  const d = date ? new Date(date) : null;
  if (d && !isNaN(d)) {
    const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
    where.birthDate = { [Op.between]: [dayStart, dayEnd] };
  }

  try {
    const users = await Users.findAll(
      {
        attributes: ['user_id', 'username', 'name', 'surname', 'birthDate', 'mail', 'role'],
        where
      })
    res.json(users)

  } catch (err) {
    return res.status(500).json({ error: err, message: "Can't retrive the user data" })
  }
}
exports.updateUser = async (req, res) => {


  // === Controllo username ===
  if (req.body.username !== undefined) {
    const username = req.body.username.trim();

    // Vuoto
    if (username.length === 0) {
      return res.status(400).json({ error: "Username non può essere vuoto" });
    }

    // Troppo lungo
    if (username.length > 20) {
      return res.status(400).json({ error: "Username troppo lungo (max 20 caratteri)" });
    }

    // Solo caratteri validi (opzionale)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: "Username contiene caratteri non validi" });
    }
  }
  await Users.update(req.body, {

    where: { user_id: req.user.user_id },
  })
    .then(() => {
      res.status(200).json("Utente aggiornato");
    })
    .catch((err) => {
      res.status(404).json("Utente non aggiornato a causa di utente non trovato");
    });
}


exports.getInfoUser = async (req, res) => {

}

exports.updatePassword = async (req, res) => {
  if (!req.body.newPassword) {
    return res.status(400).json({ error: "La password non può essere vuota" });
  }
  const password = req.body.newPassword;

  if (password.length < 8) {
    return res.status(400).json({ error: "La password deve avere almeno 8 caratteri" });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: "La password deve contenere almeno una lettera maiuscola" });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: "La password deve contenere almeno una lettera minuscola" });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: "La password deve contenere almeno un numero" });
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ error: "La password deve contenere almeno un carattere speciale" });
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.newPassword, salt);

  req.body.newPassword = hash;
  await Users.update({ password: req.body.newPassword }, {
    where: { user_id: req.user.user_id },
  })
    .then(() => {
      res.status(200).json("Password aggiornata");
    })
    .catch((err) => {
      res.status(404).json("Password non aggiornata a causa di utente non trovato");
    });
}

exports.getRoleByToken = async (req, res) => {
  return (req.user) ? res.json(req.user.role) : res.status(404).json("Error: Could not find data about user")
}