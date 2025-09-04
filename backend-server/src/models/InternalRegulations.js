/* 
Il file InternalRegulations.js definisce il modello InternalRegulations per interagire con la tabella "Regulation" nel database.
- Campi definiti:
    - rule_id: chiave primaria, intero auto-incrementato.
    - title: stringa, obbligatoria.
    - object: stringa, obbligatoria.
    - body: stringa, obbligatoria.
    - uploaded_by: chiave esterna che fa riferimento alla tabella "Users".
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "Regulation".
- Associazioni:
    - Ogni regolamento appartiene a un utente tramite la chiave esterna "user_id".
    - Ogni regolamento può essere associato a molti PDF tramite la tabella intermedia "RegulationPdf".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/

module.exports = (sequelize, DataTypes) =>{
    const InternalRegulations = sequelize.define("InternalRegulations",{
            rule_id:
            {
                type: DataTypes.INTEGER(11),
                allowNull:false,
                autoIncrement: true,
                primaryKey: true
            },
            title:{
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            object:{
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            uploaded_by:{
                type:DataTypes.INTEGER,
                references:{
                    model: "Users",
                    key: "user_id"
    
                },
            },
        },
        {
            tableName:"InternalRegulations",
        },


    )
    InternalRegulations.associate = (models) =>{
        InternalRegulations.belongsTo(models.Users, {
            foreignKey: "user_id",
        });
        InternalRegulations.hasMany(models.Pdfs,
            {
                foreignKey: "rule_id",

            }
        )
    }


  
    return InternalRegulations;
}
