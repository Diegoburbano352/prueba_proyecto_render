const db = require('../models');
const Client = db.client; 
const Op = db.Sequelize.Op;

// Crear y guardar cliente 
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado;
    console.log('Usuario logeado:', usuariologeado);

    if (!req.body.nombre) {
        res.status(400).send({
            message: 'Complete el campo del nombre ya que no puede estar vacío'
        });
        return;
    }
    
    // Obtener el ID del usuario autenticado desde el token JWT
    const idUsuario = req.user.logeado.id;
    console.log(req.user);

    const client = {
        nombre: req.body.nombre,
        apellido: req.body.apellido || null,
        direccion: req.body.direccion || null,
        nit: req.body.nit || null,
        telefono: req.body.telefono || null,
        email: req.body.email || null,
        estado: req.body.estado || true,
        userId: idUsuario  // Asumiendo que la relación con el usuario está basada en userId
    };

    // Guardar el cliente en la base de datos
    Client.create(client)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            console.log('Error al crear cliente:', err);
            res.status(500).send({
                message: err.message || 'Error al crear el cliente en la base de datos'
            });
        });
};


// Obtener el cliente asociado al usuario autenticado
exports.getMyClient = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else { 
        const userId = req.user.logeado.id; 
    Client.findOne({ where: { userId: userId } })
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

        }
};

// Actualizar el cliente asociado al usuario autenticado
exports.updateMyClient = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else { 
        const userId = req.user.logeado.id; 
        Client.update(req.body, { where: { userId: userId } })
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

    }
};

// Eliminar el cliente asociado al usuario autenticado
exports.deleteMyClient = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else { 
        const userId = req.user.logeado.id; 
        Client.destroy({ where: { userId: userId } })
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
    }
};
