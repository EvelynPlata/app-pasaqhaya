var express = require('express');
var router = express.Router();
const {
    home,
    pedidos,
    pedidoDetalle,
    confirmarPagoPedido
} = require('../controllers/adminController');

/* GET home listing. */
router.get('/home', home);

router.get('/pedidos', pedidos);

router.get('/pedidoDetalle', pedidoDetalle);

router.post('/confirmarPagoPedido', confirmarPagoPedido);

module.exports = router;
