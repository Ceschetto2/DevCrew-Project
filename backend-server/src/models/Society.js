
module.exports = (sequelize, DataTypes) => {
    const Society = sequelize.define("Society", {
        p_iva: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adress: {
            type: DataTypes.STRING,
            allowNull: false

        },
        house_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        society_mail: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        tableName: 'Society',
        timestamps: true,
    });

    Society.associate = (models) => {
        Society.hasMany(models.Users,
            { foreignKey: "society_id" }
        )
    }


    return Society;
};
