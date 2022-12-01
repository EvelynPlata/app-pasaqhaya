var express = require('express');
var router = express.Router();
const {
    pedidosPorCliente,
} = require('../controllers/pedidosController');

/* GET compra listing. */
router.get('/misPedidos', pedidosPorCliente);

module.exports = router;