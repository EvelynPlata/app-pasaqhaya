var express = require("express");
var router = express.Router();
db = require("../db/connection-db");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const respDB = await db("SELECT	productos.* FROM productos WHERE productos.estado = 1", []);
  /* lista = [];
  const LONGITUD_PEDAZOS = 4; // Partir en arreglo de 4
  for (let i = 0; i < respDB.data.length; i += LONGITUD_PEDAZOS) {
    let pedazo = respDB.data.slice(i, i + LONGITUD_PEDAZOS);
    lista.push(pedazo);
  }
  console.log(lista); */
  if (respDB.ok) {
    res.render("index", { productos: respDB.data });
  } else {
    res.render("error",);
  }
});

router.post("/agregar/carrito", async function (req, res, next) {
  let total_pago = 0;
  const sqlPedidosPorCliente = `SELECT p.id_pedido,p.id_cliente,dp.id_producto,p.total_pago,dp.cantidad_producto,dp.precio_producto_unitario,dp.precio_producto_total
  FROM pedidos AS p LEFT JOIN	detalle_pedidos AS dp	ON p.id_pedido = dp.id_pedido
  WHERE	p.id_cliente = 2 AND p.estado_pago = 0 AND p.estado_compra = 0`;
  const sqlInsertPedido = "INSERT INTO pedidos (id_cliente, total_pago) VALUES (?, ?);";
  const sqlInsertDetallePedidos = "INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad_producto, precio_producto_unitario, precio_producto_total) VALUES (?, ?, ?, ?, ?);";
  const sqlUpdatePedido = "UPDATE pedidos SET total_pago = ? WHERE id_pedido = ?;";
  const { id_cliente, id_producto, precio } = req.body;
  const dbPedido = await db(sqlPedidosPorCliente, [id_cliente]);
  const pedidosPorCliente = dbPedido.ok ? dbPedido.data : [];
  if (pedidosPorCliente.length === 0) {
    const dbInsertPedido = await db(sqlInsertPedido, [id_cliente, precio]);
    if (dbInsertPedido.ok) {
      const id_pedido = dbInsertPedido.data.insertId
      const dbInsertDetallePedidos = await db(sqlInsertDetallePedidos, [id_pedido, id_producto, 1, precio, precio]);
      if (!dbInsertDetallePedidos.ok) {
        console.log('Error al agregar al carrito detalles_pedidos');
      }
      console.log('Agregado al carrito');
    } else {
      console.log('Error al agregar al carrito pedido');
    }
  } else {
    console.log('carrito existe');
    const detallePedido = pedidosPorCliente.find(dp => dp.id_producto == id_producto);
    if (detallePedido === undefined) {
      const dbInsertDetallePedidos = await db(sqlInsertDetallePedidos, [pedidosPorCliente[0].id_pedido, id_producto, 1, precio, precio]);
      if (dbInsertDetallePedidos.ok) {

        for (let i = 0; i < pedidosPorCliente.length; i++) {
          console.log(pedidosPorCliente[i]);
          total_pago = total_pago + parseFloat(pedidosPorCliente[i].precio_producto_total);
        }
        console.log(total_pago);
        total_pago = total_pago + parseFloat(precio);
        console.log(total_pago);
        const dbUpdatePedido = await db(sqlUpdatePedido, [total_pago, pedidosPorCliente[0].id_pedido]);
        if (!dbUpdatePedido.ok) {
          console.log('Error al agregar al carrito detalle_pedidos');
        }
        console.log('Agregado al carrito');
      } else {
        console.log('Error al agregar al carrito pedido');
      }
    } else {
      console.log('Ya existe en el carrito');
    }
  }
  //console.log(pedidoPorCliente);
  //res.send('Categorías');
});

router.get("/carrito", async function (req, res, next) {
  res.render("carrito/carrito");
});

router.get("/categoria", async function (req, res, next) {
  res.send("Categorías");
});

module.exports = router;
