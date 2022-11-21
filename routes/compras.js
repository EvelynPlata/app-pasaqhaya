var express = require('express');
var router = express.Router();
const { 
    compra,
    actualizarDatos
} = require('../controllers/comprasController')

/* GET compra listing. */
router.get('/', compra);

router.post('/actualizarDatos', actualizarDatos);

module.exports = router;
