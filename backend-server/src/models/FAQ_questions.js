/* 
Il file FAQ_questions.js definisce il modello FaqQuestion per interagire con la tabella "FaqQuestions" nel database.
- Campi definiti:
    - faqQuestion_id: chiave primaria, intero auto-incrementato.
    - question: stringa, obbligatoria.
    - answare: stringa, obbligatoria.
    - uploaded_by: chiave esterna che fa riferimento alla tabella "Users".
    - createdAt: data, obbligatoria, gestita automaticamente.
    - updatedAt: data, obbligatoria, gestita automaticamente.
- Configura il nome della tabella come "FaqQuestions".
- Associazioni:
    - Ogni domanda frequente appartiene a un utente tramite la chiave esterna "user_id".
- Esporta il modello per essere utilizzato in altre parti dell'applicazione.
*/

module.exports = (sequelize, DataTypes) => {
  const FaqQuestions = sequelize.define(
    "FaqQuestions",
    {
      faqQuestion_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      answare: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
    },
    {
      tableName: "FaqQuestions",
    }
  );
  FaqQuestions.associate = (models) => {
    FaqQuestions.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
  };
  return FaqQuestions;
};
