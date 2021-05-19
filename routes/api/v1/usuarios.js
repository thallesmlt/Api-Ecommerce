const router = require("express").Router();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuarioController");

const Validation = require("express-validation");
const {UsuarioValidation} = require("../../../controllers/validacoes/usuarioValidation"); //esta dentro de um objeto, por isso {}

const usuarioController = new UsuarioController();


router.post("/login", Validation(UsuarioValidation.login), usuarioController.login); //testado
router.post("/registrar", Validation(UsuarioValidation.store), usuarioController.store); //testado
router.put("/", auth.required, Validation(UsuarioValidation.update), usuarioController.update); //testado
router.delete("/", auth.required ,usuarioController.remove); //testado

//Recuperar senha - entregar html, nao faz parte da api em si
router.get("/recuperar-senha", usuarioController.showRecovery); // tela recuperaçao senha /testado
router.post("/recuperar-senha", usuarioController.createRecovery); // enviar email de recuperacao //testado
router.get("/senha-recuperada", usuarioController.showCompleteRecovery); // digitar efetivamente a nova senha //testado
router.post("/senha-recuperada", usuarioController.completeRecovery); // envio da nova senha para o servidor //testado

router.get("/",auth.required, usuarioController.index); //testado
router.get("/:id",auth.required, Validation(UsuarioValidation.show), usuarioController.show); //testado

module.exports = router;