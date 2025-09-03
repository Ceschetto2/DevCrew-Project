const { Society } = require('../../models');

exports.getSocietyData = async (req, res) => {
    try {
        const societyData = await Society.findAll()
        return res.json(societyData[0])
    } catch (err) {
        return res.status(500).json({err: err, message: "Error. Could not save the data"})
    }
}

exports.sendSocietyData = async (req, res) => {
    societyData = req.body
    try {
        await Society.create(societyData)
        return res.json("Inserimento avvenuto con successo")
    } catch (err) {
        return res.status(500).json({err: err, message: "Error. Could not save the data"})
    }

}

exports.updateSocietyData = async (req,res) =>{
    const { p_iva, createdAt, updatedAt, ...updateData } = req.body;
    try{
        const [updatedFields] = await Society.update(updateData, { where:{ p_iva } })
        if(updatedFields === 0){
            return res.status(404).json("Error, updating a not esisting Society identified by P_IVA")
        }
    return res.json("Update Succesfull")
    }catch(err)
    {
        return res.status(500).json({error:err, message: "Could not update the society data"})
    }
}