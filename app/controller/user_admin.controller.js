const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;


// Consultar todos los usuarios
exports.findAll = (req, res) => {
    //const idProducto = req.params.id;
    const usuariologeado = req.user.logeado;

    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });
    } else {
        User.findAll()
        .then(data => {
            if (data.length === 0) {
                return res.status(404).send({ message: 'No hay usuarios disponibles.' });
            } else {
                // Transforma los datos si es necesario antes de enviar la respuesta
                const transformedData = data.map(user => ({
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    rol: user.rol
                }));
                res.send(transformedData);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener los usuarios'
            });
        });
    }
};

// Actualizar un usuario por su ID
exports.update = (req, res) => {
    const idUsuario = req.params.id;
    const usuariologeado = req.user.logeado;
    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        return res.status(403).send({
            message: 'Acceso denegado: se requiere el rol de administrador'
        });
    }

    User.update(req.body, { where: { id: idUsuario } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Usuario actualizado exitosamente'
                });
            } else {
                res.status(404).send({
                    message: `No se pudo actualizar el usuario con id=${idUsuario}. Puede que el usuario no exista o la solicitud esté vacía.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al actualizar el usuario con id=${idUsuario}`
            });
        });
};

// Eliminar un usuario por su ID
exports.delete = (req, res) => {
    const idUsuario = req.params.id;
    const usuariologeado = req.user.logeado;
    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        return res.status(403).send({
            message: 'Acceso denegado: se requiere el rol de administrador'
        });
    }
    User.destroy({ where: { id: idUsuario } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Usuario eliminado exitosamente'
                });
            } else {
                res.status(404).send({
                    message: `No se pudo eliminar el usuario con id=${idUsuario}. Puede que el usuario no exista.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al eliminar el usuario con id=${idUsuario}`
            });
        });
};

