const db = require('../models');
const Client = db.Clientuser; // Asumiendo que el modelo se llama Clientuser

// Crear y guardar cliente
exports.create = (req, res) => {
    if (!req.body.nombre) {
        return res.status(400).send({
            message: 'El campo del nombre no puede estar vacío'
        });
    }

    const client = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        nit: req.body.nit,
        telefono: req.body.telefono,
        email: req.body.email,
        estado: req.body.estado || true
    };

    Client.create(client)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al crear el cliente en la base de datos'
            });
        });
};

// Obtener el cliente asociado al usuario autenticado
exports.getMyClient = (req, res) => {
    const userId = req.user.logeado.id; 

    Clientuser.findOne({ where: { userId: userId } })
        .then(client => {
            if (client) {
                res.send(client);
            } else {
                res.status(404).send({
                    message: 'No se encuentra el cliente asociado a este usuario'
                });
            }
        })
        .catch(err => {
            console.log('Error al obtener el cliente del usuario:', err);
            res.status(500).send({
                message: err.message || 'Error al obtener el cliente del usuario'
            });
        });
};

// Actualizar el cliente asociado al usuario autenticado
exports.updateMyClient = (req, res) => {
    const userId = req.user.logeado.id; 

    Clientuser.update(req.body, { where: { userId: userId } })
        .then(num => {
            if (num === 1) {
                res.send({ message: 'Cliente actualizado correctamente' });
            } else {
                res.status(404).send({ message: 'No se encontró el cliente asociado a este usuario' });
            }
        })
        .catch(err => {
            console.log('Error al actualizar el cliente del usuario:', err);
            res.status(500).send({ message: err.message || 'Error al actualizar el cliente del usuario' });
        });
};

// Eliminar el cliente asociado al usuario autenticado
exports.deleteMyClient = (req, res) => {
    const userId = req.user.logeado.id; 

    Clientuser.destroy({ where: { userId: userId } })
        .then(num => {
            if (num === 1) {
                res.send({ message: 'Se eliminó el cliente asociado a este usuario correctamente' });
            } else {
                res.status(404).send({ message: 'No se encontró el cliente asociado a este usuario' });
            }
        })
        .catch(err => {
            console.log('Error al eliminar el cliente del usuario:', err);
            res.status(500).send({ message: err.message || 'Error al eliminar el cliente del usuario' });
        });
};
