/* 
Il file Pdfs.js definisce il modello Pdf per interagire con la tabella "Pdfs" nel database.
- Campi definiti:
    - file_path: stringa, chiave primaria, obbligatoria.
    - preview: stringa, obbligatoria.
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "Pdfs".
- Associazioni:
    - Ogni PDF può essere associato a più bandi tramite la tabella intermedia "NoticePdfs".
    - Ogni PDF può essere associato a più regolamenti interni tramite la tabella intermedia "InternalRegulationsPdfs".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/
module.exports = (sequelize, DataTypes) => {
    const Pdfs = sequelize.define("Pdfs", {
        file_path: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING,
            allownull: false,

        },

        notice_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: "Notices",
                key: "notice_id"
            },

        },
        rule_id:{
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
            model: "InternalRegulations",
            key: "rule_id"
        },

    }
    },
{
    tableName: 'Pdfs',
})
Pdfs.associate = (models) => {
    Pdfs.belongsTo(models.Notices,
        {

            foreignKey: "notice_id",

        }
    )
    Pdfs.belongsTo(models.InternalRegulations,
        {
            foreignKey: "rule_id",
        }
    )

}

return Pdfs;
}