const { validationResult, matchedData} = require('express-validator');

module.exports = {
    signin: async (req,res)=>{

    },
    signup: async (req,res)=>{
        const erros = validationResult(req);
        if(!erros.isEmpty()){
            res.json({error: erros.mapped()});
            return;
        }
        const data = matchedData(req);

        res.json({tudocerto: true, data})
    }
}