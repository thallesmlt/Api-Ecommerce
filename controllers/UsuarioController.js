const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const enviarEmailRecovery = require("../helpers/email-recovery");
const usuario = require("../models/usuario");

class UsuarioController{
    //GET//
    index(req, res, next){ //next para middleware
        Usuario.findById(req.payload.id).then(usuario =>{ //paload metodo do express para retornar id
            if(!usuario) return res.status(401).json({errors: "Usuário não registrado!!"});
            return res.json({usuario: usuario.enviarAuthJSON() });
        }).catch(next); 
    }

    //GET /id  Procurar por funcionario(apenas para o adm do sistema)
    show(req,res,next){
        Usuario.findById(req.params.id)
        //.populate({path: "loja"})
        .then(usuario => {
            if(!usuario) return res.status(401).json({errors: "Usuário não registrado!!"});
            return res.json({
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email,
                    permissao: usuario.permissao,
                    loja: usuario.loja
                }
            });
        }).catch(next);
    }

    //Post / registrar
    store(req,res,next){
        
        const {nome, email, password, loja} = req.body;
        const usuario = new Usuario({nome, email, loja});
        
        usuario.setSenha(password);
        
        usuario.save()
        .then(() => res.json({ usuario: usuario.enviarAuthJSON() }))
        .catch((err) => {
            console.log(err);
            next(err);
        });
    } // parte de validação vem depoois

    //Put/
    update(req,res,next){
        const {nome,email,password} = req.body;
        Usuario.findById(req.payload.id).then(usuario => { //só pode alterar os dados dele mesmo
            if(!usuario) return res.status(401).json({errors: "Usuário não registrado!!"});
            if(typeof nome !== "undefined") usuario.nome = nome;
            if(typeof email !== "undefined") usuario.email = email;
            if(typeof senha !== "undefined") usuario.setSenha(password); //criptografia

            return usuario.save().then(() => {
                return res.json({usuario: usuario.enviarAuthJSON() });
            }).catch(next);
        }).catch(next);
    }

    //DELETE / 
    remove(req, res,next){
        Usuario.findById(req.payload.id).then(usuario => {
            if(!usuario) return res.status(401).json({errors: "Usuário não registrado!!"});
            return usuario.remove().then(() => {
                return res.json({deletado: true});
            }).catch(next);
        }).catch(next);
    }

    //POST
    login(req,res,next){
        const {email, password} = req.body; 
        Usuario.findOne({email}).then((usuario) => { //findOne pois o usuario ainda nao esta logado, nao pode-se usar req.payload.id
            if(!usuario) return res.status(401).json({errors: "Usuário não registrado!!"});
            if(!usuario.validarSenha(password)) return res.status(401).json({errors: "Senha inválida!!"});
            return res.json({usuario: usuario.enviarAuthJSON() });
        }).catch(next);
    }

    //Recovery

    //Get  /recuperar senha
    showRecovery(req,res,nest){ //retornar a view para recuperaçao da senha, por isso retorna render
        return res.render('recovery', {error: null, success: null});
    }

    // Post /recuperar senha / enviar o email de reucuperacao
    createRecovery(req, res, next){
        const { email } = req.body;
        if(!email) return res.render('recovery', { error: "Preencha com o seu email", success: null });

        Usuario.findOne({ email }).then((usuario) => {
            if(!usuario) return res.render("recovery", { error: "Não existe usuário com este email", success: null });
            const recoveryData = usuario.criarTokenRecuperacaoSenha();
            return usuario.save().then(() => {
                enviarEmailRecovery({ usuario, recovery: recoveryData }, (error = null, success = null) => {
                    return res.render("recovery", { error, success });
                });
            }).catch(next);
        }).catch(next);
    }

    // Get /senha recuperada
    showCompleteRecovery(req, res, next){
        if(!req.query.token) return res.render("recovery", {error: "Token não identificado", success: null}); //verificar se o token existe
        Usuario.findOne({"recovery.token": req.query.token}).then(usuario => {
            if(!usuario) return res.render("recovery", {error: "Não existe usúario com este token!", success: null });
            if(new Date(usuario.recovery.date) < new Date ()) return res.render("recovery", {error: "Token expirado!" , success: null});
            return res.render("recovery/store" , {error: null, success: null, token: req.query.token});
        }).catch(next);
    }

    //Post /senha=recuperada
    completeRecovery(req, res, next){
        const{token, password} = req.body;
        if(!token || !password) return res.render("recovery/store", {error: "Preencha novamente com sua senha", success: null, token: token });
        Usuario.findOne({"recovery.token": token}).then(usuario => {
            if(!usuario) return res.render("recovery", {error: "Usuário não identificado", success: null });
            usuario.finalizarTokenRecuperacaoSenha();
            usuario.setSenha(password);
            return usuario.save().then(() => {
                return res.render("recovery/store", {
                    error: null,
                    success: "Senha alterada com sucesso!! Tente fazer o login",
                    token: null
                });
            }).catch(next);
        }).catch(next);
    }
}

module.exports = UsuarioController;
