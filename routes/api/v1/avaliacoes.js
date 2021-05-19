const router = require("express").Router();

const AvaliacaoController = require("../../../controllers/AvaliacaoController");
const {LojaValidation} = require("../../../controllers/validacoes/lojaValidation");
const auth = require("../../auth");
const Validation = require("express-validation");
const {AvaliacaoValidation} = require("../../../controllers/validacoes/avaliacaoValidation");

const avaliacaoController = new AvaliacaoController();


//Clientes/Visitantes
router.get("/", Validation(AvaliacaoValidation.index), avaliacaoController.index);
router.get("/:id", Validation(AvaliacaoValidation.show), avaliacaoController.show);
router.post("/",auth.required , Validation(AvaliacaoValidation.store), avaliacaoController.store);

//Admin 
router.delete("/:id", auth.required, LojaValidation.admin, Validation(AvaliacaoValidation.remove) ,avaliacaoController.remove);

module.exports = router;