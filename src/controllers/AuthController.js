const { validationResult, matchedData} = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const State = require('../models/State');
const bcrypt = require('bcrypt');

module.exports = {
    signin: async (req,res)=>{
        const erros = validationResult(req);
        if(!erros.isEmpty()){
            res.json({error: erros.mapped()});
            return;
        }
        const data = matchedData(req);
        const user = await User.findOne({email: data.email});
        if(!user){
            res.json({error: 'E-mail e/ou senha errados!'});
            return;
        }
        //validando a senha
        const match = bcrypt.compare(data.password, user.passwordHash);
        if(!match){
            res.json({error: 'E-mail e/ou senha errados!'});
            return;
        }
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);
        user.token = token;
        await user.save();
        res.json({token, email:data.email});

    },
    signup: async (req,res)=>{
        const erros = validationResult(req);
        if(!erros.isEmpty()){
            res.json({error: erros.mapped()});
            return;
        }
        const data = matchedData(req);
        const user = await User.findOne({email: data.email});
        if(user){
            res.json({
                error:{ email:{msg: "E-mail já existe!"}}
            });
            return;
        }
        //verificando se o estado existe
        if(mongoose.Types.ObjectId.isValid(data.state)){
            const stateItem = await State.findById(data.state);
            if(!stateItem){
                res.json({
                    error:{ state:{msg: "o estado informado não existe!"}}
                });
                return;
            }
           
        }else{
            res.json({
                error:{ state:{msg: "código de estado inválido!"}}
            });
            return;
        }
        const passwordHash = await bcrypt.hash(data.password,10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);
        const newUser = new User({
            name: data.name,
            email: data.email,
            passwordHash: passwordHash,
            token : token,
            state: data.state
        });
        await newUser.save();

        res.json({token});
    }
}