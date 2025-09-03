module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define("Events", {
        event_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        eventType: {
            type: DataTypes.STRING(255),
            allowNull: false

        },
        start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end: {
            type: DataTypes.DATE,
            allowNull: true
        },
        allDay: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        competitionCode: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,

        },
        boatType: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        costalType: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: "Users",
                key: "user_id"
            }
        }
    }, {
        tableName: 'Events',
    });

    Events.associate = (models) => {
        Events.belongsTo(models.Users, {
            foreignKey: "createdBy",
        });

        Events.belongsToMany(models.Users, {
            as: "participants",
            through: "EventsPartecipations",
            foreignKey: "event_id",
            otherKey: "user_id",
            onDelete: 'cascade'
        })
    };


    return Events;


}