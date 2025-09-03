
const nodemailer = require("nodemailer");

/**
 * Trasportatore Nodemailer configurato per utilizzare il servizio Gmail per l'invio delle email.
 * 
 * @constant
 * @type {import('nodemailer').Transporter}
 * @property {Object} auth - Oggetto di autenticazione per Gmail.
 * @property {string} auth.user - Indirizzo Gmail utilizzato per inviare le email.
 * @property {string} auth.pass - Password specifica per l'app di Gmail.
 */

 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rms072296@gmail.com",
    pass: process.env.GOOGLE_MAIL_API_KEY,
  },
});


module.exports=transporter;