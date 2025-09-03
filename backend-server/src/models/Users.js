/* 
Il file Users.js definisce il modello Users per interagire con la tabella "Users" nel database.
- Campi definiti:
  - user_id: chiave primaria, intero auto-incrementato.
  - username: stringa, obbligatoria.
  - password: stringa, obbligatoria.
  - name: stringa, opzionale.
  - surname: stringa, opzionale.
  - rule: stringa, opzionale.
  - mail: stringa, opzionale.
  - createdAt: data, obbligatoria, gestita automaticamente.
  - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "Users" e abilita i timestamp.
- Associazioni:
  - Un utente può essere associato a più record nelle tabelle:
    - Notices
    - InternalRegulations
    - News
    - GalleryImages
    - FaqQuestions
  - Ogni associazione utilizza la chiave esterna "user_id".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/

const Society = require("./Society");

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        surname: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        birthDate:{
            type: DataTypes.DATE,
            allowNull:false
        },
        role: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        mail: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        society_id: {
            type: DataTypes.STRING,
            references: {
                model: "Society",
                key: "p_iva"

            },
        },

    }, {
        tableName: 'Users',
        timestamps: true,
    });

    Users.associate = (models) => {
        Users.hasMany(models.Notices, {
            foreignKey: "user_id"
        });
        Users.hasMany(models.InternalRegulations, {
            foreignKey: "user_id"
        });
        Users.hasMany(models.News, {
            foreignKey: "user_id"
        });
        Users.hasMany(models.GalleryImages, {
            foreignKey: "user_id"
        });
        Users.hasMany(models.FaqQuestions, {
            foreignKey: "user_id"
        });
        Users.belongsToMany(models.Events, {
            as: "joinedEvents",
            through: "EventsPartecipations",
            foreignKey: "user_id",
            other_key: "event_id"
        })
        Users.belongsTo(models.Society,{
            foreignKey: 'society_id'
        })

    };

    return Users;
};
