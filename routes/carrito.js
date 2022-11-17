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


module.exports = router;
