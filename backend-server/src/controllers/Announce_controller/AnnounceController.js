const { Op } = require("sequelize");
const{Announce,Users}=require("../../models");


const transporter = require("../mailer");

exports.sendAvviso=async (req,res)=>{
  

    try{
        console.log(req.body);
        const{title, body}=req.body;
        if (!title) {
      return res.status(400).json({ error: "Il titolo è obbligatorio" });
    }
    if(!body){
         return res.status(400).json({ error: "Devi compilare l'avviso" });
    }

    const announce=await Announce.create({
        title:title,
        body:body
       
        
    });
    const users = await Users.findAll({
      attributes: ["mail", "name","surname"], // recupero solo quello che serve
    });
    
    for(const user of users){
  const info = transporter.sendMail({
    from: '"Associazione Vogatori Ostuni", rms072296@gmail.com',
    to: user.mail,
    subject: "Avviso:"+ title,
    text: `Ciao ${user.name},\n\n ${body}\n\nQuesto è un messaggio automatico.\n\nE' stato inserito un nuovo avviso.\n\nSaluti,\nIl team RMS`,
  })};


     return res.status(201).json({
      message: "Avviso inserito con successo",
      avviso:announce
    });

    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Errore nella creazione dell'avviso",details: error.message});
    }
};
exports.getAvviso=async(req,res)=>{
  try{
    console.log(req.query);
    const {data, date, isOrdGrow, n_obj } = req.query;
  
    limit = null;
    if (n_obj) {
      limit = parseInt(n_obj)
    }
    let where = {}
    if (data) {
      where = {
        [Op.or]: [
          { title: { [Op.like]: `%${data}%` } },
          { body: { [Op.like]: `%${data}%` } },
        ]
      }
    }
    if (date) {
      const dayStart = new Date(date + 'Z'); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date + 'Z'); dayEnd.setHours(23, 59, 59, 999);
      where.createdAt = { [Op.between]: [dayStart, dayEnd] };
    }
    let order = null
    order = String(isOrdGrow).toLowerCase()
    if (order) {
      order = [['title', order === 'true' ? 'ASC' : 'DESC']]
    }else order = [['createdAt', 'ASC']]
    

     const announce=await Announce.findAll({attributes:['announce_id','title','body','createdAt'],where,limit,order});
    res.json(announce)
  }  catch(error){
    res.status(500).json({error:"Errore nel percepimento degli avvisi", details: error.message});
  }

};
exports.deleteAvviso=async(req,res)=>{
  const announce_id=req.query.announce_id;
    try{
        const deleted=await Announce.destroy({where:{ announce_id }});
        
        if(deleted){

           return res.json({ message: "Avviso eliminato con successo" });
    } else {
      return res.status(404).json({ error: "Avviso non trovato" });
    }
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Errore nell'eliminazione",details:error.message});
    }


}
