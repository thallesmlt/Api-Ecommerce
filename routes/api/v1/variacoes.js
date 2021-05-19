const router = require("express").Router();

const VariacaoController = require("../../../controllers/variacaoController");

const {LojaValidation} = require("../../../controllers/validacoes/lojaValidation");
const auth = require("../../auth");
const upload = require("../../../config/multer");
const Validation = require("express-validation");
const {VariacaoValidation} = require("../../../controllers/validacoes/variacaoValidation");

const variacaoController = new VariacaoController();

//Clientes e usuarios
router.get("/", Validation(VariacaoValidation.index), variacaoController.index);
router.get("/:id", Validation(VariacaoValidation.show), variacaoController.show);

//Admin
router.post("/",auth.required, LojaValidation.admin, Validation(VariacaoValidation.store), variacaoController.store);
router.put("/:id", auth.required, LojaValidation.admin, Validation(VariacaoValidation.update), variacaoController.update);
router.put("/images/:id",auth.required, LojaValidation.admin, Validation(VariacaoValidation.updateImages), upload.array("files", 4),variacaoController.updateImages);
router.delete("/:id", auth.required, LojaValidation.admin, Validation(VariacaoValidation.remove), variacaoController.remove);

module.exports = router;

