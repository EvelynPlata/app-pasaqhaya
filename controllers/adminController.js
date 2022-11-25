const {
    listaPedidos,
    pedidoPorId,
    confirmarPagoPedidoPorId
} = require('../model/pedidosModel');

/* GET users listing. */
home = async (req, res, next) => {
    res.render('admin/home', {});
};

pedidos = async (req, res, next) => {
    const pedidos = await listaPedidos();
    console.log(pedidos);
    res.render('admin/pedidos', { pedidos });
};

pedidoDetalle = async (req, res, next) => {
    const { id_pedido } = req.query;
    const pedido = await pedidoPorId(id_pedido);
    console.log(pedido);
    res.render('admin/pedidoDetalle', { pedido });
};

confirmarPagoPedido = async (req, res, next) => {
    console.log(req.body);
    let respJSON = null;
    const { id_pedido } = req.body;

    const respDb = await confirmarPagoPedidoPorId(id_pedido);

    if (respDb === null) {
        respJSON = {
            ok: false,
            msg: 'Error al actualizar los datos',
            data: {
                respDb
            }
        }
    }
    respJSON = {
        ok: true,
        msg: 'Pago confirmado correctamente',
        data: {
            respDb
        }
    }

    res.json(respJSON);
};

module.exports = {
    home,
    pedidos,
    pedidoDetalle,
    confirmarPagoPedido
};
