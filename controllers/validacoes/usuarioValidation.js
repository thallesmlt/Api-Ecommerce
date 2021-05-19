const BaseJoi = require("joi");
const Extensions = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extensions);

const UsuarioValidation = {
    login: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    show: {
        params:{
            id: Joi.string().alphanum().length(24).required()
        }
    },
    store: {
        body: {
            nome:  Joi.string(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            loja: Joi.string().alphanum().length(24).required()
        }
    },
    update: {
        body: {
            nome:  Joi.string().optional(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }
};

module.exports = {
    UsuarioValidation
};