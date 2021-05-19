const Joi = require("joi");

const CategoriaValidation = {
    index: {
        query:{ 
            loja: Joi.string().alphanum().length(24).required()
        }
    },
    indexDisponiveis:{
        query:{ 
            loja: Joi.string().alphanum().length(24).required()
        }
    },
    show: {
        query:{
            loja: Joi.string().alphanum().length(24).required()
        },
        params:{ 
            id: Joi.string().alphanum().length(24).required()
        }
    },
    store:{
        body: {
            nome: Joi.string().required(),
            codigo: Joi.string().required()
        } // nao precisa da query da loja pois só o adm tem permissao para chegar aqui
    },
    update: { 
        params:{
            id: Joi.string().alphanum().length(24).required()
        },
        body: {
            nome: Joi.string().optional(),
            codigo: Joi.string().optional(),
            disponibilidade: Joi.boolean().optional(),
            produtos: Joi.array().items(Joi.string().alphanum().length(24).required()).optional()
        }
    },
    remove:{ 
        params:{
            id: Joi.string().alphanum().length(24).required()
        }
    }
    

}

module.exports = {CategoriaValidation};