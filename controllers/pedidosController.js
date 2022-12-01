const { pedidosPorIdCliente } = require('../model/pedidosModel');

/* GET pedidos listing. */
pedidosPorCliente = async (req, res, next) => {
    const { id_cliente } = req.query;
    console.log(id_cliente);
    const pedidos = await pedidosPorIdCliente(id_cliente);
    console.log(pedidos);
    res.render('carrito/misPedidos', { pedidos });
};


module.exports = {
    pedidosPorCliente
};
