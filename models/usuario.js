const mongoose = require("mongoose"),
    Schema= mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Não pode ficar vazio."]
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Não pode ficar vazio."],
        index: true,
        match: [/\S+@\S+\.\S+/, 'é inválido']
    },
    loja:{
        type: Schema.Types.ObjectId,
        ref: "Loja",
        required: [true,"não pode ficar vazia."]
    },
    permissao: {
        type: Array,
        default: ["cliente"]
    },
    hash: String,
    salt: String,
    recovery:{
        type:{
            token: String,
            date: Date
        },
        default: {}
    }
},{timestamps: true});

UsuarioSchema.plugin(uniqueValidator, {message: "Já está sendo utilizado"});  //Exibir mensagem ao tentar inserir um dado unico ja existente

UsuarioSchema.methods.setSenha = function(password){
    this.salt = crypto.randomBytes(16).toString("hex"); //cria uma string em hexademical para ser usada junto da senha
    this.hash = crypto.pbkdf2Sync(password, this.salt,10000,512,"sha512").toString("hex");
};

UsuarioSchema.methods.validarSenha = function(password){
    hash = crypto.pbkdf2Sync(password, this.salt,10000,512,"sha512").toString("hex"); //criptografa a senha do usuario
    return hash === this.hash; //compara a senha informado pelo usuario com a hash salva no banco
};

UsuarioSchema.methods.gerarToken = function(){
    const hoje = new Date();
    const exp = new Date(hoje);
    exp.setDate(hoje.getDate() + 15);

    return jwt.sign({
        id: this._id,
        email: this.email,
        nome: this.nome,
        exp: parseFloat(exp.getTime() /1000, 10)
    }, secret); 
};

UsuarioSchema.methods.enviarAuthJSON = function(){
    return {
        _id: this._id,
        nome: this.nome,
        email: this.email,
        loja: this.loja,
        role: this.permissao,
        token: this.gerarToken()
    };
};


//Recuperação de Senha
UsuarioSchema.methods.criarTokenRecuperacaoSenha = function(){
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString("hex");
    this.recovery.date = new Date(new Date().getTime()+ 24*60*60*1000);
    return this.recovery;
}

//Limpar configuração token
UsuarioSchema.methods.finalizarTokenRecuperacaoSenha = function(){
    this.recovery = {token: null, date: null};
    return this.recovery;
}

module.exports = mongoose.model("Usuario", UsuarioSchema);
