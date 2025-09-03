/* 
Il file index.js configura e inizializza i modelli Sequelize per interagire con il database.
- Legge la configurazione del database dal file config.json in base all'ambiente (development, production, ecc.).
- Crea un'istanza di Sequelize per connettersi al database.
- Carica dinamicamente tutti i file modello presenti nella directory corrente (escludendo i file di test e il file stesso).
- Associa i modelli tra loro se è definita una funzione associate nel modello.
- Esporta l'oggetto db contenente tutti i modelli e l'istanza Sequelize per essere utilizzati in altre parti dell'applicazione.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
//const Sequelize = require('sequelize').Sequelize;
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
