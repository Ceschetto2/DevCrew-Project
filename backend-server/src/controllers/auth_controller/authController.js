const { Users } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  console.log("auth in corso...");
  try {
    //findOne è una where di una query , metodo di sequelize che cerca il primo record
    //  che corrisponde alla condizione specificata
    const user = await Users.findOne({
      where: { username: req.body.username },
    });

    if (user !== null) {
      //Confronta la password inserita con quella salvata nel database
      //bcrypt.compare confronta la password inserita con quella salvata nel database
      if (await bcrypt.compare(req.body.password, user.password)) {
        //Genera un token JWT con i dati dell'utente e una chiave segreta
        //Il token ha una durata di 1 ora
        //secretKey è una chiave segreta usata per firmare il token
        delete user.dataValues.password
        delete user.dataValues.username
        const token = jwt.sign(user.dataValues, process.env.BCRYPY_SECERT_KEY, {
          expiresIn: "1h",
        });
        username = user.dataValues.username;
        const refreshToken = jwt.sign({ username },  process.env.BCRYPY_SECERT_KEY, {
          expiresIn: "7d",
        });



        //Imposta il token refreshtoke come cookie nella risposta
        //Il cookie è httpOnly, sameSite=None e secure=true per garantire la sicurezza
        //httpOnly impedisce l'accesso al cookie da parte di JavaScript
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        //200-300 sono i codici di stato HTTP per indicare una risposta positiva
        //Restituisce il token JWT come risposta  
        return res.status(200).json({ token: token, role: user.role });
      }


    }
    return res.status(404).json("username o password errati");

  } catch (err) {
    return res.status(401).json("Errore" + err);
  }
};

//Middleware per l'autenticazione (veriica la validità del token nell'header della richesta prima
//dell'esecuzione del metodo)
exports.tokenValidation = (req, res, next) => {
  if(!req.headers.authorization) return res.status(401).json("token Assente")
  const token = req.headers["authorization"];
  //console.log(token);
  if (token === null) return res.status(401).json("Token non valido");
  jwt.verify(token, process.env.BCRYPY_SECERT_KEY, (err, user) => {
    if (err)
      return res
        .status(401)
        .json("Richiesta rifiutata, permessi non sufficenti " + err);
    req.user = user;
    return next();
  });
};

exports.roleValidation = (validRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json("Richiesta Rifiutata, utente non autenticato");
      }

      const role = req.user.role;

      if (validRoles.length === 0 || validRoles.includes(role)) {
        return next();
      }

      return res.status(403).json("Richiesta Rifiutata, permessi non sufficienti");

    } catch (err) {
      return res.status(401).json("Richiesta Rifiutata, errore nell'identificazione del ruolo");
    }
  };
};