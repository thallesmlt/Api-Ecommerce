const router = require("express").Router();

const ClienteController = require("../../../controllers/ClienteController");
const { LojaValidation } = require("../../../controllers/validacoes/lojaValidation");
const { ClienteValidation } = require("../../../controllers/validacoes/clienteValidation");
const Validation = require("express-validation");
const auth = require("../../auth");

const clienteController = new ClienteController();

// ADMIN
router.get("/", auth.required, LojaValidation.admin, Validation(ClienteValidation.index), clienteController.index); //testado
//router.get("/search/:search/pedidos", auth.required, LojaValidation.admin, Validation(ClienteValidation.searchPedidos), clienteController.searchPedidos);
router.get("/search/:search", auth.required, LojaValidation.admin, Validation(ClienteValidation.search), clienteController.search); //testado
router.get("/admin/:id", auth.required, LojaValidation.admin, Validation(ClienteValidation.showAdmin), clienteController.showAdmin); //testado
//router.get("/admin/:id/pedidos", auth.required, LojaValidation.admin, Validation(ClienteValidation.showPedidosCliente), clienteController.showPedidosCliente);

router.delete("/admin/:id", auth.required, LojaValidation.admin, clienteController.removeAdmin); //testado

router.put("/admin/:id", auth.required, LojaValidation.admin, Validation(ClienteValidation.updateAdmin), clienteController.updateAdmin); //testado

// CLIENTE
router.get("/:id", auth.required, Validation(ClienteValidation.show), clienteController.show); //testado

router.post("/", Validation(ClienteValidation.store),  clienteController.store); //testado
router.put("/:id", auth.required, Validation(ClienteValidation.update), clienteController.update); //testado
router.delete("/:id", auth.required, clienteController.remove); //testado


module.exports = router;
