/* 
Il file Notices.js definisce il modello Notices per interagire con la tabella "Notices" nel database.
- Campi definiti:
    - notice_id: chiave primaria, intero auto-incrementato.
    - title: stringa, obbligatoria.
    - object: stringa, obbligatoria.
    - body: stringa, obbligatoria.
    - uploaded_by: chiave esterna che fa riferimento alla tabella "Users".
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "Notices".
- Associazioni:
    - Ogni avviso appartiene a un utente tramite la chiave esterna "user_id".
    - Ogni avviso può essere associato a molti PDF tramite la tabella intermedia "NoticesPdfs".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/

module.exports = (sequelize, DataTypes) => {
    const Notices = sequelize.define( "Notices",
        {
            notice_id: {
                type: DataTypes.INTEGER(11),
                allowNull:false,
                autoIncrement: true,
                primaryKey: true,

            },

            title:{
                type: DataTypes.STRING(255),
                allowNull:false,
            },
            object:{
                type: DataTypes.STRING(255),
                allowNull:false,
            },
            body:{
                type: DataTypes.TEXT,
                allowNull:true,
            },
            uploaded_by:{
                type:DataTypes.INTEGER,
                references:{
                    model:"Users",
                    key: "user_id"

                },
            },
            createdAt: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                
            },
        },
        {
            tableName: 'Notices',
        },
    ) 
    Notices.associate= (models) =>{
        Notices.belongsTo(models.Users,
            {
                foreignKey:"user_id",
            }
        )
        Notices.hasMany(models.Pdfs,
            {
              
                foreignKey:"notice_id",
          
                
            }
        )

    };
return Notices;

}