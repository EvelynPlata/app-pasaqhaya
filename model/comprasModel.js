db = require("../db/connection-db");

carritoPorCliente = async (id_cliente) => {
    const sqlCarritoPorCliente = `SELECT p.id_pedido,p.id_cliente,p.total_pago,productos.id_producto,dp.cantidad_producto,dp.precio_producto_unitario,dp.precio_producto_total,
    productos.nombre,productos.descripcion,productos.tipo,productos.precio,productos.imagen,productos.stock,p.imagen_qr
    FROM pedidos AS p LEFT JOIN detalle_pedidos AS dp ON p.id_pedido = dp.id_pedido INNER JOIN productos ON dp.id_producto = productos.id_producto
    WHERE p.id_cliente = ? AND p.estado_pago = 0 AND p.estado_compra = 0 AND productos.estado = 1`;
    const dbCarrito = await db(sqlCarritoPorCliente, [id_cliente]);
    console.log(dbCarrito);
    if (dbCarrito.ok) {
        return dbCarrito.data;
    } else {
        return null
    }
}

module.exports = {
    carritoPorCliente
}