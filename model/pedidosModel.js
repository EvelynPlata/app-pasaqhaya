db = require("../db/connection-db");

updateInfPedidoPorId = async (id_pedido, direccion_entrega) => {
    const sql = `UPDATE pedidos SET direccion_entrega = ?, fecha_pedido = NOW() WHERE id_pedido = ?;`;
    const respDb = await db(sql, [direccion_entrega, id_pedido]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

listaPedidos = async () => {
    const sql = `SELECT * FROM pedidos
    where estado_pago != 0 or estado_compra != 0`;
    const respDb = await db(sql, []);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

pedidoPorId = async (id_pedido) => {
    const sql = `SELECT p.id_pedido, p.id_cliente, u.nombre AS nombre_cliente, u.apellidos AS apellidos_cliente, u.email, u.telefono, c.departamento, c.direccion_cliente,
    p.direccion_entrega, p.fecha_pedido, p.total_pago, p.forma_pago, p.estado_pago, p.estado_compra, p.imagen_comprobante, 
    pr.id_producto, pr.nombre, pr.precio, pr.imagen, dp.cantidad_producto, dp.precio_producto_unitario, dp.precio_producto_total
    FROM pedidos p, detalle_pedidos dp, productos pr, clientes c, usuarios u
    WHERE	p.id_pedido = dp.id_pedido AND p.id_cliente = c.id_cliente AND c.id_cliente = u.id_usuario AND
	dp.id_producto = pr.id_producto AND	p.id_pedido = ?`;
    const respDb = await db(sql, [id_pedido]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

confirmarPagoPedidoPorId = async (id_pedido) => {
    const sql = `UPDATE pedidos SET fecha_entrega = NULL, estado_pago = 1 WHERE id_pedido = ?;`;
    const respDb = await db(sql, [id_pedido]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

module.exports = {
    updateInfPedidoPorId,
    listaPedidos,
    pedidoPorId,
    confirmarPagoPedidoPorId
}