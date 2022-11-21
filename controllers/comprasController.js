var express = require('express');
const { carritoPorCliente } = require('../model/comprasModel');
const { clientePorId, updateClienteDatosPorId } = require('../model/usuariosModel');
const { updateInfPedidoPorId } = require('../model/pedidosModel');

/* GET users listing. */
compra = async (req, res, next) => {
    const { id_cliente } = req.query;
    console.log(id_cliente);
    const carrito = await carritoPorCliente(id_cliente);
    const cliente = await clientePorId(id_cliente);
    console.log('carrito', carrito);
    console.log('cliente', cliente);
    res.render('carrito/compra', { carrito, cliente });
};

actualizarDatos = async (req, res, next) => {
    const { id_cliente, id_pedido, departamento, telefono, direccion_entrega } = req.body;
    console.log(req.body);
    
    const respDbUsuario = await updateClienteTelefonoPorId(id_cliente, telefono);
    const respDbCliente = await updateClienteDatosPorId(id_cliente, departamento);
    const respDbPedido = await updateInfPedidoPorId(id_pedido, direccion_entrega);

    let respJSON = null;
    if (respDbUsuario === null && respDbCliente === null && respDbPedido === null) {
        respJSON = {
            ok: false,
            msg: 'Error al actualizar los datos',
            data: {
                respDbUsuario,
                respDbCliente,
                respDbPedido
            }
        }
    }
    respJSON = {
        ok: true,
        msg: 'Datos de envió actualizados correctamente',
        data: {
            respDbUsuario,
            respDbCliente,
            respDbPedido
        }
    }

    res.json(respJSON);
};

module.exports = {
    compra,
    actualizarDatos
};
