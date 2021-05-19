const Joi = require("joi");


const AvaliacaoValidation = {
    //Admin
    index:{
        query:{
            produto: Joi.string().alphanum().length(24).required(),
            loja: Joi.string().alphanum().length(24).required()
        }
    },
    show:{
        query:{
            produto: Joi.string().alphanum().length(24).required(),
            loja: Joi.string().alphanum().length(24).required()
        },
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    store:{
        query:{
            produto: Joi.string().alphanum().length(24).required(),
            loja: Joi.string().alphanum().length(24).required()
        },
        body: {
            nome: Joi.string().required(),
            texto: Joi.string().required(),
            pontuacao: Joi.number().min(1).max(5).required()
        }
    },
    remove:{
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    }

};

module.exports = {AvaliacaoValidation};