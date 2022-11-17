const mysql = require("mysql2/promise");

// Crear la conexión pool. configurando los datos de acceso a la DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  port: 3307,
  database: "pasaqhayadb",
});

/*
sql = sql de consulta: select, insert, update, delete
values = es un array de datos
*/
db = async (sql, values) => {
  try {
    const respDB = await pool.query(sql, values);
    return {
      ok: true,
      data: respDB[0],
    };
  } catch (error) {
    console.log("ERROR", error);
    return {
      ok: false,
      error: {
        msg: "Error al realizar la consulta a la base de datos",
        code: error.code || null,
        errno: error.errno || null,
        sql: error.sql || null,
        sqlState: error.sqlState || null,
        sqlMessage: error.sqlMessage || null,
      },
    };
  }
};

module.exports = db;
