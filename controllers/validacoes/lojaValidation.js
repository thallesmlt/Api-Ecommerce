const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const Loja = mongoose.model("Loja");
//const usuario = require("../../models/usuario");

const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension); // junção dos joi de testes




const LojaValidation = {
    admin: (req,res,next) => {
    
        if(!req.payload.id) return res.sendStatus(401); //falta de autorização acess //o problema esta nessa linha
        
        const { loja } = req.query; //formato ?
        
        if(!loja) return res.sendStatus(401);
        Usuario.findById(req.payload.id).then(usuario => {
            if(!usuario) return res.sendStatus(401); // estiver logado
            if(!usuario.loja) return res.sendStatus(401); //tiver loja cadastrada
            if(!usuario.permissao.includes("admin")) return res.sendStatus(401); // se ele é admin de alguma loja
            console.log(usuario.loja.toString());
            console.log(loja);
            if(usuario.loja.toString() !== loja) return res.sendStatus(401); // se a loja que ele esta cadastrado é a que ele quer alterar
            
            next();
        }).catch(next);
    },
    show:{
        params: {
        id: Joi.string().alphanum().length(24).required()
            }
    },
    store:{
        body:{
            nome: Joi.string().required(),
            cnpj: Joi.string().length(18).required(), 
            email: Joi.string().email().required(), 
            telefones: Joi.array().items(Joi.string()).required(), 
            endereco: Joi.object({
                local: Joi.string().required(),
                numero: Joi.string().required(),
                complemento: Joi.string().optional(),
                bairro: Joi.string().required(),
                cidade: Joi.string().required(),
                CEP: Joi.string().required(),
            }).required()       
        }
    },
    update:{
        body:{
            nome: Joi.string().optional(),
            cnpj: Joi.string().length(18).optional(), 
            email: Joi.string().email().optional(), 
            telefones: Joi.array().items(Joi.string()).optional(), 
            endereco: Joi.object({
                local: Joi.string().required(),
                numero: Joi.string().required(),
                complemento: Joi.string().optional(),
                bairro: Joi.string().required(),
                cidade: Joi.string().required(),
                CEP: Joi.string().required(),
            }).optional()
        }  
    },

};

module.exports = {LojaValidation};