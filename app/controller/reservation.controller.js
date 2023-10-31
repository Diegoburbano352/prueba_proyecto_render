const db = require('../models');
const Reservation = db.reservation;
const Room = db.room;
const Op = db.Sequelize.Op;

// Crear y guardar reservación
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const { tipo_reserva, fecha_entrada, fecha_salida, roomId } = req.body;
        if (!tipo_reserva || !fecha_entrada || !fecha_salida || !roomId) {
            return res.status(400).send({ message: 'Por favor, proporcione todos los campos necesarios.' });
        }
    
        // Verificar disponibilidad de la habitación
        Reservation.findOne({
            where: {
                roomId,
                [Op.or]: [
                    {
                        fecha_entrada: { [Op.between]: [fecha_entrada, fecha_salida] }
                    },
                    {
                        fecha_salida: { [Op.between]: [fecha_entrada, fecha_salida] }
                    }
                ]
            }
        }).then(existingReservation => {
            if (existingReservation) {
                return res.status(400).send({ message: 'La habitación ya está reservada en esas fechas.' });
            }
    
            const idUsuario = req.user.logeado.id;
            console.log(req.user);
            // Crear la reserva
            Reservation.create({
                tipo_reserva,
                fecha_entrada,
                fecha_salida,
                hora: req.body.hora, // Asegúrate de que "hora" sea proporcionada en el cuerpo de la solicitud
                precio: req.body.precio, // Asegúrate de que "precio" sea proporcionado en el cuerpo de la solicitud
                roomId,
                userId: idUsuario
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear la reservación en la base de datos.'
                });
            });
        });
    }

};

// Consulta de reservas por tipo de reservación o listar todas las reservaciones
exports.findAll = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const tipo_reserva = req.query.tipo_reserva;
        var condition = tipo_reserva ? { tipo_reserva: { [Op.iLike]: `%${tipo_reserva}%` } } : null;
        Reservation.findAll({
            where: condition,
            include: Room
        })
            .then(data => {
                if (data.length === 0) {
                    if (!tipo_reserva) {
                        return res.status(404).send({ message: 'No hay reservaciones disponibles.' });
                    }
    
                    const message = `No se encontraron reservaciones del tipo '${tipo_reserva}'.`;
                    return res.status(404).send({ message });
                } else {
                    // Modificación para mostrar el nombre de la habitación en lugar del ID y precio con "Q"
                    const modifiedData = data.map(item => {
                        return {
                            id: item.id,
                            tipo_reserva: item.tipo_reserva,
                            fecha_entrada: item.fecha_entrada,
                            fecha_salida: item.fecha_salida,
                            hora_entrada: item.hora_entrada,
                            hora_salida: item.hora_salida,
                            precio: `Q${item.precio}`,
                            habitacion: item.room.tipo_habitacion, // Mostrar el nombre de la habitación
                        };
                    });
    
                    res.send(modifiedData);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener las reservaciones.'
                });
            });
    }
};

// Seleccionar la reservación por ID
exports.findOne = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Reservation.findByPk(id)
            .then(data => {
                if (data) {
                    // Modificación para mostrar el precio con "Q"
                    const modifiedData = {
                        id: data.id,
                        tipo_reserva: data.tipo_reserva,
                        fecha_entrada: data.fecha_entrada,
                        fecha_salida: data.fecha_salida,
                        hora_entrada: data.hora_entrada,
                        hora_salida: data.hora_salida,
                        precio: `Q${data.precio}`,
                        habitacion: data.room.tipo_habitacion, // Mostrar el nombre de la habitación
                    };
                    res.send(modifiedData);
                } else {
                    res.status(404).send({
                        message: `No se encuentra la reservación con el ID=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al obtener la reservación con ID=" + id
                });
            });
    }
};

// Consulta de reservas por tipo de reservación
exports.findByName = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const tipo_reserva = req.params.tipo_reserva;
        var condition = tipo_reserva ? { tipo_reserva: { [Op.iLike]: `%${tipo_reserva}%` } } : null;
    
        Reservation.findAll({ where: condition, include: Room })
            .then(data => {
                // Modificación para mostrar el precio con "Q"
                const modifiedData = data.map(item => {
                    return {
                        id: item.id,
                        tipo_reserva: item.tipo_reserva,
                        fecha_entrada: item.fecha_entrada,
                        fecha_salida: item.fecha_salida,
                        hora_entrada: item.hora_entrada,
                        hora_salida: item.hora_salida,
                        precio: `Q${item.precio}`,
                        habitacion: item.room.tipo_habitacion, // Mostrar el nombre de la habitación
                    };
                });
                res.send(modifiedData);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener la reservación por tipo de reservación.'
                });
            });
    }
};

// Actualizar la reservación por ID
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
    Reservation.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Reservación actualizada correctamente por ID.'
                });
            } else {
                res.send({
                    message: `No se encontró la reservación con el ID: ${id}, o no existe.`
                });
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar la reservación con ID=" + id
            });
        });
        }
};

// Eliminar la reservación por ID
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Reservation.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'Se eliminó la reservación correctamente.'
                    });
                } else {
                    res.send({
                        message: `El ID de la reservación: ${id} no existe.`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se logró eliminar la reservación con ID=" + id
                });
            });
    }
};
