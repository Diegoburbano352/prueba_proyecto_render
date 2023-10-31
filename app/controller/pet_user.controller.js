const db = require('../models');
const Pet = db.pet;
const Op = db.Sequelize.Op;

// Crear y guardar mascota (el usuario autenticado es propietario de la mascota)
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
    

    const mascota = {
        nombre: req.body.nombre,
        raza: req.body.raza || null,
        edad: req.body.edad || null,
        sexo: req.body.sexo || true,
        userId: idUsuario
    };

    Pet.create(mascota)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            console.log('Error al crear mascota:', err);
            res.status(500).send({
                message: err.message || 'Error al crear la mascota en la base de datos'
            });
        });
};

// Consultar las mascotas del usuario autenticado
exports.findAll = (req, res) => {
    let usuariologeado = req.user.logeado.id;
    console.log('Usuario logeado:', usuariologeado);

    const idUsuario = req.user.logeado.id;
    console.log('ID de usuario autenticado:', idUsuario);

    Pet.findAll({ where: { userId: idUsuario } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log('Error al obtener mascotas:', err);
            res.status(500).send({
                message: err.message || 'Error al obtener las mascotas del usuario'
            });
        });
};

// Buscar una mascota por ID (asegurarse de que pertenezca al usuario autenticado)
exports.findOne = (req, res) => {
    let usuariologeado = req.user.logeado.id;
    console.log('Usuario logeado:', usuariologeado);

    const idMascota = req.params.id;
    const idUsuario = req.user.logeado.id;
    console.log('ID de mascota:', idMascota);
    console.log('ID de usuario autenticado:', idUsuario);

    Pet.findOne({ where: { id: idMascota, userId: idUsuario } })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `No se encuentra la mascota con id=${idMascota} o no pertenece al usuario`
                });
            }
        })
        .catch(err => {
            console.log('Error al obtener la mascota por ID:', err);
            res.status(500).send({
                message: "Error al obtener la mascota con id=" + idMascota
            });
        });
};

// Actualizar la mascota por ID (asegurarse de que pertenezca al usuario autenticado)
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado.id;
    console.log('Usuario logeado:', usuariologeado);

    const idMascota = req.params.id;
    const idUsuario = req.user.logeado.id;
    console.log('ID de mascota:', idMascota);
    console.log('ID de usuario autenticado:', idUsuario);

    Pet.update(req.body, {
        where: { id: idMascota, userId: idUsuario }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: 'Mascota actualizada correctamente'
                });
            } else {
                res.status(404).send({
                    message: `No se encontró la mascota con el id: ${idMascota}, o no pertenece al usuario`
                });
            }
        })
        .catch(err => {
            console.log('Error al actualizar la mascota por ID:', err);
            res.status(500).send({
                message: "Error al actualizar la mascota con id=" + idMascota
            });
        });
};

// Eliminar la mascota por ID (asegurarse de que pertenezca al usuario autenticado)
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado;
    console.log('Usuario logeado:', usuariologeado);

    const idMascota = req.params.id;
    const idUsuario = req.user.logeado.id;
    console.log('ID de mascota:', idMascota);
    console.log('ID de usuario autenticado:', idUsuario);

    Pet.destroy({
        where: { id: idMascota, userId: idUsuario }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: 'Se eliminó la mascota correctamente'
                });
            } else {
                res.status(404).send({
                    message: `El id de la mascota: ${idMascota} no existe o no pertenece al usuario`
                });
            }
        })
        .catch(err => {
            console.log('Error al eliminar la mascota por ID:', err);
            res.status(500).send({
                message: "No se pudo eliminar la mascota con el id=" + idMascota
            });
        });
};
