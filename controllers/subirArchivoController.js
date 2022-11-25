var fileUpload = require('express-fileupload');
/* GET users listing. */
guardarArchivo = (archivo, ruta, name) => {
    const promise = new Promise((resolve, reject) => {        
        archivo.mv(`${ruta}/${name}`, (error) => {
            if(error) {
                reject({
                    ok: false,
                    msg: 'Error al guardar el archivo',
                    data:{
                        error
                    }
                });
            }
            resolve({
                ok: true,
                msg: 'Archivo guardado correctamente',
                data: {
                    ruta
                }
            });
        });
    });
    return promise
};

module.exports = {
    guardarArchivo
};
