const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);

const ClienteValidation = {


    /* Endpoint do Admin*/
    index: {
        query:{
            offset: Joi.number(),
            limit: Joi.number()
        }
    },
    search: {
        query:{
            limit: Joi.number(),
            offset: Joi.number()
        },
        params: {
            search: Joi.string().required()
        }
    },
    showAdmin: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    updateAdmin: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        },
        body: {
            nome: Joi.string().optional(), 
            cpf: Joi.string().length(14).optional(), 
            email: Joi.string().email().optional(), 
            telefones: Joi.array().items(Joi.string()).optional(), 
            endereco: Joi.object({
                local: Joi.string().required(),
                numero: Joi.string().required(),
                complemento: Joi.string(),
                bairro: Joi.string().required(),
                cidade: Joi.string().required(),
                estado: Joi.string().required(),
                CEP: Joi.string().required(),
            }).optional(), //se o objeto existir o que está contido nele é obrigatorio
            dataDeNascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
        }
    },


    /* Endpoint do Cliente*/
    show: {
        query: {
            loja: Joi.string().alphanum().length(24).required()
        }
    },
    update: {
        query: {
            loja: Joi.string().alphanum().length(24).required()
        },
        params: {
            id: Joi.string().alphanum().length(24).required()
        },
        body: {
            nome: Joi.string().optional(), 
            cpf: Joi.string().length(14).optional(), 
            password: Joi.string().optional(),
            email: Joi.string().email().optional(), 
            telefones: Joi.array().items(Joi.string()).optional(), 
            endereco: Joi.object({
                local: Joi.string().required(),
                numero: Joi.string().required(),
                complemento: Joi.string(),
                bairro: Joi.string().required(),
                cidade: Joi.string().required(),
                estado: Joi.string().required(),
                CEP: Joi.string().required(),
            }).optional(), //se o objeto existir o que está contido nele é obrigatorio
            dataDeNascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
        }   
    },
    store: {
        query: {
            loja: Joi.string().alphanum().length(24).required()
        },
        body: {
            nome: Joi.string().required(), 
            cpf: Joi.string().length(14).required(), 
            email: Joi.string().email().required(), 
            telefones: Joi.array().items(Joi.string()).required(),
            password: Joi.string().required(), 
            endereco: Joi.object({
                local: Joi.string().required(),
                numero: Joi.string().required(),
                complemento: Joi.string(),
                bairro: Joi.string().required(),
                cidade: Joi.string().required(),
                estado: Joi.string().required(),
                CEP: Joi.string().required(),
            }).required(), //se o objeto existir o que está contido nele é obrigatorio
            dataDeNascimento: Joi.date().format("YYYY-MM-DD").raw().required()
        }
    },

}

module.exports = ({ClienteValidation});