var express = require("express");
var router = express.Router();
db = require("../db/connection-db");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const respDB = await db("SELECT * FROM producto", []);
  /* lista = [];
  const LONGITUD_PEDAZOS = 4; // Partir en arreglo de 4
  for (let i = 0; i < respDB.data.length; i += LONGITUD_PEDAZOS) {
    let pedazo = respDB.data.slice(i, i + LONGITUD_PEDAZOS);
    lista.push(pedazo);
  }
  console.log(lista); */
  res.render("index", { productos: respDB.data });
});

router.get("/categoria", async function (req, res, next) {
  res.send("Categorías");
});

module.exports = router;
