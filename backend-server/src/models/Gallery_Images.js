/* 
Il file Gallery_Images.js definisce il modello GalleryImage per interagire con la tabella "GalleryImages" nel database.
- Campi definiti:
    - img_id: chiave primaria, intero auto-incrementato.
    - img_url: stringa, obbligatoria.
    - title: stringa, opzionale.
    - informations: stringa, opzionale.
    - uploaded_by: chiave esterna che fa riferimento alla tabella "Users".
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "GalleryImages".
- Associazioni:
    - Ogni immagine della galleria appartiene a un utente tramite la chiave esterna "user_id".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/


module.exports = (sequelize, DataTypes) => {
    const GalleryImages = sequelize.define("GalleryImages", {
        img_id: {
            type: DataTypes.INTEGER(11),
            allowNull:false,
            autoIncrement: true,
            primaryKey: true

        },
        img_url: {
            type:DataTypes.STRING(255),
            allowNull:false,

        },
        title:{
            type:DataTypes.STRING(255),
            allowNull:true,

        },
        informations:{
            type:DataTypes.JSON,
            allowNull:true,

        },
        uploaded_by:{
            type:DataTypes.INTEGER(11),
            allowNull:true,
            references:{
                model: "Users",
                key: "user_id"

            },
        },
    },
    {
        tableName: 'GalleryImages',
    })
    GalleryImages.associate = (models)=>{
        GalleryImages.belongsTo(models.Users,
            {
                foreignKey:"user_id",
            }
        )
    }
    return GalleryImages;
};