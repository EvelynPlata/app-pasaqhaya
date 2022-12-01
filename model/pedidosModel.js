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

pedidosPorIdCliente = async (id_cliente) => {
    const sql = `SELECT	pedidos.id_pedido, pedidos.id_cliente, pedidos.direccion_entrega, pedidos.fecha_pedido, pedidos.fecha_entrega, pedidos.total_pago, pedidos.forma_pago, 
	pedidos.estado_pago, pedidos.estado_compra, pedidos.imagen_comprobante, productos.id_producto, productos.nombre, productos.descripcion, productos.tipo, productos.precio, 
	productos.imagen, detalle_pedidos.cantidad_producto, detalle_pedidos.precio_producto_unitario, detalle_pedidos.precio_producto_total
    FROM pedidos INNER JOIN	detalle_pedidos ON pedidos.id_pedido = detalle_pedidos.id_pedido INNER JOIN productos ON detalle_pedidos.id_producto = productos.id_producto
    WHERE estado_pago <> 0 OR estado_compra <> 0 AND pedidos.id_cliente = ? ORDER BY pedidos.fecha_pedido DESC`;
    let datos = [];
    const respDb = await db(sql, [id_cliente]);
    console.log(respDb);
    if (respDb.ok) {
        respDb.data.forEach(e => {
            const existeDato = datos.find( d => e.id_pedido == d.id_pedido);
            if (existeDato === undefined) {
                datos.push({
                    id_pedido: e.id_pedido,
                    id_cliente: e.id_cliente,
                    direccion_entrega: e.direccion_entrega,
                    fecha_pedido: e.fecha_pedido,
                    fecha_entrega: e.fecha_entrega,
                    total_pago: e.total_pago,
                    forma_pago: e.forma_pago,
                    estado_pago: e.estado_pago,
                    estado_compra: e.estado_compra,
                    imagen_comprobante: e.imagen_comprobante,
                    productos: [
                        {
                            id_producto: e.id_producto,
                            nombre: e.nombre,
                            descripcion: e.descripcion,
                            tipo: e.tipo,
                            precio: e.precio,
                            imagen: e.imagen,
                            cantidad_producto: e.cantidad_producto,
                            precio_producto_unitario: e.precio_producto_unitario,
                            precio_producto_total: e.precio_producto_total
                        }
                    ]
                })
            }else {
                existeDato.productos.push(
                    {
                        id_producto: e.id_producto,
                        nombre: e.nombre,
                        descripcion: e.descripcion,
                        tipo: e.tipo,
                        precio: e.precio,
                        imagen: e.imagen,
                        cantidad_producto: e.cantidad_producto,
                        precio_producto_unitario: e.precio_producto_unitario,
                        precio_producto_total: e.precio_producto_total
                    }
                )
            }
        });
        return datos;
    } else {
        return []
    }
}

module.exports = {
    updateInfPedidoPorId,
    listaPedidos,
    pedidoPorId,
    confirmarPagoPedidoPorId,
    pedidosPorIdCliente
}