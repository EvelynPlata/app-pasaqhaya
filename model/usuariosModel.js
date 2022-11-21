db = require("../db/connection-db");

clientePorId = async (id_cliente) => {
    const sql = `SELECT clientes.id_cliente,usuarios.nombre,usuarios.apellidos,usuarios.email,usuarios.telefono,clientes.departamento,clientes.direccion_cliente
    FROM clientes INNER JOIN usuarios ON clientes.id_cliente = usuarios.id_usuario WHERE clientes.id_cliente = ?`;
    const respDb = await db(sql, [id_cliente]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data[0];
    } else {
        return null
    }
}

updateClienteTelefonoPorId = async (id_cliente, telefono) => {
    const sql = `UPDATE usuarios SET telefono = ? WHERE id_usuario = ?;`;
    const respDb = await db(sql, [telefono, id_cliente]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

updateClienteDatosPorId = async (id_cliente, departamento) => {
    const sql = `UPDATE clientes SET departamento = ? WHERE id_cliente = ?;`;
    const respDb = await db(sql, [departamento, id_cliente]);
    console.log(respDb);
    if (respDb.ok) {
        return respDb.data;
    } else {
        return null
    }
}

module.exports = {
    clientePorId,
    updateClienteTelefonoPorId,
    updateClienteDatosPorId
}