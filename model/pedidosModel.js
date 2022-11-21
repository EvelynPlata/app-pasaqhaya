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

module.exports = {
    updateInfPedidoPorId
}