var express = require('express');
var router = express.Router();
const { 
    compra,
    actualizarDatos,
    completarOrden
} = require('../controllers/comprasController')

/* GET compra listing. */
router.get('/', compra);

router.post('/actualizarDatos', actualizarDatos);

router.post('/completarOrden', completarOrden);

module.exports = router;
