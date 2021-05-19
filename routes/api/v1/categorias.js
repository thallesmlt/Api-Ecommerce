const router = require("express").Router();

const CategoriaController = require("../../../controllers/CategoriaController");
const auth = require("../../auth");
const Validation = require("express-validation");
const { LojaValidation} = require("../../../controllers/validacoes/lojaValidation");
const {CategoriaValidation} = require("../../../controllers/validacoes/CategoriaValidation");

const categoriaController = new CategoriaController();

router.get("/", Validation(CategoriaValidation.index),categoriaController.index); //testado
router.get("/disponiveis", Validation(CategoriaValidation.indexDisponiveis), categoriaController.indexDisponiveis); //testado
router.get("/:id", Validation(CategoriaValidation.show) ,categoriaController.show); //testado

router.post("/",auth.required, LojaValidation.admin, Validation(CategoriaValidation.store), categoriaController.store); //testado
router.put("/:id", auth.required, LojaValidation.admin, Validation(CategoriaValidation.update), categoriaController.update); //testado
router.delete("/:id",auth.required, LojaValidation.admin, Validation(CategoriaValidation.remove), categoriaController.remove); //testado

//Rotas Relacionadas ao Produto
router.get("/:id/produtos",categoriaController.showProdutos);
router.put("/:id/produtos", auth.required, LojaValidation.admin, categoriaController.updateProdutos);

module.exports = router;
