/* 
Il file News.js definisce il modello Notizia per interagire con la tabella "News" nel database.
- Campi definiti:
    - news_id: chiave primaria, intero auto-incrementato.
    - title: stringa, obbligatoria.
    - object: stringa, obbligatoria.
    - description: stringa, obbligatoria.
    - img_url: stringa, opzionale.
    - uploaded_by: chiave esterna che fa riferimento alla tabella "Users".
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "News".
- Associazioni:
    - Ogni notizia appartiene a un utente tramite la chiave esterna "user_id".
    - Ogni notizia può essere associata a molti PDF tramite la tabella intermedia "NewsPdf".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/

module.exports = (sequelize, DataTypes) =>{
    const News = sequelize.define("News", {
        news_id: {
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
        description:{
            type: DataTypes.STRING(255),
            allowNull:false,
        },
        img_url:{
            type: DataTypes.STRING(255),
            allowNull:true,
        },
        uploaded_by:{
            type:DataTypes.INTEGER(11),
            references:{
                model:"Users",
                key: "user_id"

            },
        },

    },{
        tableName: 'News',
    }
)

    News.associate=(models)=>{
        News.belongsTo(models.Users,{
            foreignKey:"user_id",
        })
    }
    
    return News;


}