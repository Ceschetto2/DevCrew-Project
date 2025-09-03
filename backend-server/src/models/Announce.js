module.exports=(sequelize,DataTypes)=>{
    const Announce=sequelize.define("Announce",{
   announce_id:{
    type:DataTypes.INTEGER(11),
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
   },
   title:{
    type:DataTypes.STRING(225),
    allowNull:false,

   },

   body:{
    type:DataTypes.TEXT,
    allowNull:false,
   },
   createdAt:{
    type: DataTypes.DATEONLY,
    allowNull:false,
   },


    },
{
    tableName:'Announce',
},
)
return Announce;
}