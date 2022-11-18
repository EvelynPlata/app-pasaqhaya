var express = require('express');
var router = express.Router();
db = require("../db/connection-db");

/* GET carrito. */
router.get("/", async function (req, res, next) {
    const { id_cliente } = req.query;
    const sqlCarritoPorCliente = `SELECT p.id_pedido,p.id_cliente,p.total_pago,productos.id_producto,dp.cantidad_producto,dp.precio_producto_unitario,dp.precio_producto_total,
    productos.nombre,productos.descripcion,productos.tipo,productos.precio,productos.imagen,productos.stock
    FROM pedidos AS p LEFT JOIN detalle_pedidos AS dp ON p.id_pedido = dp.id_pedido INNER JOIN productos ON dp.id_producto = productos.id_producto
    WHERE p.id_cliente = ? AND p.estado_pago = 0 AND p.estado_compra = 0 AND productos.estado = 1`;
    const dbCarrito = await db(sqlCarritoPorCliente, [id_cliente]);
    if (dbCarrito.ok) {
        console.log(dbCarrito.data);
        res.render("carrito/carrito", { carrito: dbCarrito.data });
    } else {
        res.render("error");
    }
});

router.post("/actualizarDatos", async function (req, res, next) {
    const { id_pedido, id_producto, cantidad_producto, precio_producto_total, id_cliente } = req.body;
    const sqlUpdateDetallePedidos = "UPDATE detalle_pedidos SET cantidad_producto = ?, precio_producto_total = ? WHERE id_pedido = ? AND id_producto = ?;";
    const sqlUpdatePedidos = `UPDATE pedidos pe, (SELECT SUM(dp.precio_producto_total) total_pago FROM pedidos AS p LEFT JOIN detalle_pedidos AS dp	ON p.id_pedido = dp.id_pedido
    WHERE p.id_cliente = ? AND p.id_pedido = ? AND p.estado_pago = 0 AND p.estado_compra = 0 GROUP BY dp.id_pedido) total_pago SET pe.total_pago = total_pago.total_pago WHERE pe.id_pedido = ?;`;
    const sqlSelectPedido = "SELECT * FROM pedidos WHERE id_pedido = ?";

    const dbUpdateDetallePedidos = await db(sqlUpdateDetallePedidos, [cantidad_producto, precio_producto_total, id_pedido, id_producto]);
    console.log("dbUpdateDetallePedidos", dbUpdateDetallePedidos);
    const dbUpdatePedidos = await db(sqlUpdatePedidos, [id_cliente, id_pedido, id_pedido]);
    console.log("dbUpdatePedidos", dbUpdatePedidos);
    const dbSelectPedido = await db(sqlSelectPedido, [id_pedido]);
    res.json({
        data: dbSelectPedido.ok ? dbSelectPedido.data : null
    })
});

router.post("/eliminarProducto", async function (req, res, next) {
    const { id_pedido, id_producto, id_cliente } = req.body;
    const sqlDeleteDetallePedido = "DELETE FROM detalle_pedidos WHERE id_pedido = ? AND id_producto = ?;"
    const sqlUpdatePedidos = `UPDATE pedidos pe, (SELECT SUM(dp.precio_producto_total) total_pago FROM pedidos AS p LEFT JOIN detalle_pedidos AS dp	ON p.id_pedido = dp.id_pedido
    WHERE p.id_cliente = ? AND p.id_pedido = ? AND p.estado_pago = 0 AND p.estado_compra = 0 GROUP BY dp.id_pedido) total_pago SET pe.total_pago = total_pago.total_pago WHERE pe.id_pedido = ?;`;
    const sqlUpdatePedidosCero = "UPDATE pedidos SET total_pago = 0 WHERE id_pedido = ?;";
    const sqlSelectPedido = "SELECT * FROM pedidos WHERE id_pedido = ?";
    const sqlCarritoPorCliente = `SELECT p.id_pedido,p.id_cliente,p.total_pago,productos.id_producto,dp.cantidad_producto,dp.precio_producto_unitario,dp.precio_producto_total,
    productos.nombre,productos.descripcion,productos.tipo,productos.precio,productos.imagen,productos.stock
    FROM pedidos AS p LEFT JOIN detalle_pedidos AS dp ON p.id_pedido = dp.id_pedido INNER JOIN productos ON dp.id_producto = productos.id_producto
    WHERE p.id_cliente = ? AND p.estado_pago = 0 AND p.estado_compra = 0 AND productos.estado = 1`;
    
    const dbDeleteDetallePedido = await db(sqlDeleteDetallePedido, [id_pedido, id_producto]);
    console.log("dbDeleteDetallePedido", dbDeleteDetallePedido);
    const dbCarrito = await db(sqlCarritoPorCliente, [id_cliente]);
    const listaCarrito = dbCarrito.ok ? dbCarrito.data : null;
    if (listaCarrito.length > 0){
        const dbUpdatePedidos = await db(sqlUpdatePedidos, [id_cliente, id_pedido, id_pedido]);
        console.log("dbUpdatePedidos", dbUpdatePedidos);
    } else {
        const dbUpdatePedidosCero = await db(sqlUpdatePedidosCero, [id_pedido]);
        console.log("dbUpdatePedidos", dbUpdatePedidosCero);
    }
    const dbSelectPedido = await db(sqlSelectPedido, [id_pedido]);
    res.json({
        data: dbSelectPedido.ok ? dbSelectPedido.data : null
    })
});

module.exports = router;
