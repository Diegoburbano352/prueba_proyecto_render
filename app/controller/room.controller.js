const db = require('../models');
const Room= db.room;
const Op = db.Sequelize.Op;

//crear y guardar reservacion, validando que tipo de rol puede realizar dicha acción 
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario para realizar esta acción'
        });            
    }else {
        if (!req.body.tipo_habitacion) {
            res.status(404).send({
                message: 'el contenido de tipo de habitacion no puede estar vacio'
            });
            return;
        }
        //Creacion de la habitacion
        const habitacion = {
            tipo_habitacion: req.body.tipo_habitacion,
            capacidad: req.body.capacidad,
            comodidades: req.body.comodidades,
            tarifa: req.body.tarifa,
            estado_disponidilidad: req.body.estado_disponidilidad ? req.body.estado_disponidilidad :true
        };
        Room.create(habitacion)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear la habitacion en la bd'
                });
            });
    }
};


// Consulta de habitaciones por tipo de habitación o listar todas las habitaciones
exports.findAll = (req, res) => {
    const tipo_habitacion = req.query.tipo_habitacion;
    var condition = tipo_habitacion ? { tipo_habitacion: { [Op.iLike]: `%${tipo_habitacion}%` } } : null;

    Room.findAll({ where: condition })
        .then(data => {
            if (data.length === 0) {
                if (!tipo_habitacion) {
                    // Si no se proporciona un tipo de habitación y no hay habitaciones, muestra un mensaje de error
                    return res.status(404).send({ message: 'No hay habitaciones disponibles.' });
                }

                const message = `No se encontraron habitaciones del tipo '${tipo_habitacion}'.`;
                return res.status(404).send({ message });
            } else {
                const updatedData = data.map(habitacion => {
                    return {
                        ...habitacion.dataValues,
                        estado_disponibilidad: habitacion.estado_disponibilidad ? "disponible" : "no disponible",
                        tarifa: `Q${habitacion.tarifa}`
                    };
                });
                res.send(updatedData);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener las habitaciones.'
            });
        });
};

// Seleccionar la habitación por ID
exports.findOne = (req, res) => {
    const id = req.params.id;
    Room.findByPk(id)
        .then(data => {
            if (data) {
                const updatedData = {
                    ...data.dataValues,
                    estado_disponibilidad: data.estado_disponibilidad ? "disponible" : "no disponible",
                    tarifa: `Q${data.tarifa}`
                };
                res.send(updatedData);
            } else {
                res.status(404).send({
                    message: `No se encuentra la habitación con el ID=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener la habitación con ID=" + id
            });
        });
};

// Seleccionar la habitación por tipo de habitación
exports.findByName = (req, res) => {
    const tipo_habitacion = req.params.tipo_habitacion;
    var condition = tipo_habitacion ? { tipo_habitacion: { [Op.iLike]: `%${tipo_habitacion}%` } } : null;
    Room.findAll({ where: condition })
        .then(data => {
            const updatedData = data.map(habitacion => {
                return {
                    ...habitacion.dataValues,
                    estado_disponibilidad: habitacion.estado_disponibilidad ? "disponible" : "no disponible",
                    tarifa: `Q${habitacion.tarifa}`
                };
            });
            res.send(updatedData);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener la habitación por tipo de habitación, asegúrese de que ese sea el tipo de habitación.'
            });
        });
};

// Actualizar la habitación por ID
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario para realizar esta acción'
        });            
    }else {
    const id = req.params.id;
    Room.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Habitación actualizada correctamente.'
                });
            } else {
                res.status(404).send({
                    message: `No se encontró la habitación con el ID: ${id}, o no existe.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar la habitación con ID=" + id
            });
        });
        }
};

// Eliminar la habitación
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if(usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario para realizar esta acción'
        });            
    }else {
    const id = req.params.id;
    Room.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Se eliminó la habitación correctamente.'
                });
            } else {
                res.status(404).send({
                    message: `El ID de la habitación: ${id} no existe.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se logró eliminar la habitación con ID=" + id
            });
        });
        }
};

