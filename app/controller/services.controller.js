const db = require('../models');
const Service= db.service;
const Op = db.Sequelize.Op;

//crear y guardar servicio
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });  
    }else {
    if (!req.body.tipo_habitacion) {
        res.status(404).send({
            message: 'el contenido de servicio no puede estar vacio'
        });
        return;
    }
    //Creacion del servicio
    const servicio = {
        servicio: req.body.servicio,
        precio: req.body.precio,
        disponible: req.body.disponible ? req.body.disponible :true
    };
    Service.create(servicio)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al crear el servicio en la bd'
            });
        });
        }
};


//consulta de  servicio o listar todos los servicios
exports.findAll = (req, res) => {
    const servicio = req.query.servicio; // Usa req.query.servicio para obtener el parámetro de consulta
    var condition = servicio ? { servicio: { [Op.iLike]: `%${servicio}%` } } : null;

    Service.findAll({ where: condition })
        .then(data => {
            if (data.length === 0) {
                const message = servicio
                    ? `No se encontraron servicios con el nombre '${servicio}'.`
                    : 'No hay servicios disponibles.';
                return res.status(404).send({ message });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener los servicios'
            });
        });
};

// Seleccionar el servicio por id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Service.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `no se encuentra el servicio con  ese id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el servicio con id=" + id
            });
        });
};

// Seleccionar el servicio
exports.findByName = (req, res) => {
    const servicio = req.params.servicio; // Utiliza req.params.servicio en lugar de req.params.id
    var condition = servicio? { servicio: { [Op.iLike]: `%${servicio}%` } } : null;
    Service.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener el servicio, asegurese de que ese sea el servicio'
            });
        });
};

//Actualizar el servicio por id, solo los adminisradores pueden actualizar los servicios
exports.update = (req, res) => 
{
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });  
    }else {
    const id = req.params.id;
    Service.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Servicio actulizado correctamente por id'
                });
            } else {
                res.send({
                    message: `'No se encontro el servicio con el id: ${id}, o no existe'`
                });
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el servicio con id=" + id
            });
        });
        }
};


//Eliminar el servicio pero solo pueden eliminar servicios los admistradores
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });  
    }else {
    const id = req.params.id;
    Service.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: ' Se elimino el servicio correctamente'
                });
            } else {
                res.send({
                    message: `'el  id de el servicio: ${id} no existe'`
                });
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "No se logro eliminar el servicio  con id=" + id
            });
        });
        }
};