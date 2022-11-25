var express = require('express');
var fileUpload = require('express-fileupload');
const { carritoPorCliente, completarCompraPorId } = require('../model/comprasModel');
const { clientePorId, updateClienteDatosPorId } = require('../model/usuariosModel');
const { updateInfPedidoPorId } = require('../model/pedidosModel');
const { guardarArchivo } = require('./subirArchivoController');

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

completarOrden = async (req, res, next) => {
    console.log("completarOrden", req.body);
    let respJSON = null;
    const { id_pedido } = req.body;
    const archivo = req.files.file;
    if (!req.files) {
        respJSON = {
            ok: false,
            msg: 'La imagen del comprobante es obligatoria',
            data: {
                error: null
            }
        };
    }
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        respJSON = {
            ok: false,
            msg: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
            data: {
                error: null
            }
        };
    }

    const respGuardar = await guardarArchivo(archivo, `public/images/comp`, `${id_pedido}.${extension}`);
    console.log(respGuardar);
    if (!respGuardar.ok) {
        return res.json(respGuardar);
    }

    const respDbPedido = await completarCompraPorId(id_pedido, `images/comp/${id_pedido}.${extension}`);
    if (respDbPedido === null) {
        respJSON = {
            ok: false,
            msg: 'Error al actualizar los datos',
            data: {
                respDbPedido
            }
        }
    }
    respJSON = {
        ok: true,
        msg: 'Pedido completado exitosamente',
        data: {
            respDbPedido
        }
    }

    res.json(respJSON);
};

module.exports = {
    compra,
    actualizarDatos,
    completarOrden
};
