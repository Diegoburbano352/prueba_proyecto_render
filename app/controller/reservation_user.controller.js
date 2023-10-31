const db = require('../models');
const Reservation = db.reservation;
const Room = db.room;
const Op = db.Sequelize.Op;


// Crear y guardar reserva
exports.create = (req, res) => {
    const { tipo_reserva, fecha_entrada, fecha_salida, roomId } = req.body;
    if (!tipo_reserva || !fecha_entrada || !fecha_salida || !roomId) {
        return res.status(400).send({ message: 'Por favor, proporcione todos los campos necesarios.' });
    }

    const idUsuario = req.user.logeado.id;

    Reservation.findOne({
        where: {
            roomId,
            [Op.or]: [
                { fecha_entrada: { [Op.between]: [fecha_entrada, fecha_salida] } },
                { fecha_salida: { [Op.between]: [fecha_entrada, fecha_salida] } }
            ],
            userId: idUsuario
        }
    }).then(existingReservation => {
        if (existingReservation) {
            return res.status(400).send({ message: 'La habitación ya está reservada por este usuario en esas fechas.' });
        }

        // Verificar disponibilidad de la habitación
        Reservation.findOne({
            where: {
                roomId,
                [Op.or]: [
                    { fecha_entrada: { [Op.between]: [fecha_entrada, fecha_salida] } },
                    { fecha_salida: { [Op.between]: [fecha_entrada, fecha_salida] } }
                ]
            }
        }).then(existingRoomReservation => {
            if (existingRoomReservation) {
                return res.status(400).send({ message: 'La habitación ya está reservada en esas fechas.' });
            }

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
    });
};


// Consulta de reservas del usuario autenticado
exports.findAll = (req, res) => {
    const userId = req.user.logeado.id; // ID del usuario autenticado desde el token

    Reservation.findAll({
        where: { userId }, // Solo se muestran las reservas asociadas al usuario autenticado
        include: Room
    })
    .then(data => {
        if (data.length === 0) {
            return res.status(404).send({ message: 'No hay reservaciones disponibles para este usuario.' });
        } else {
            const modifiedData = data.map(item => {
                return {
                    id: item.id,
                    tipo_reserva: item.tipo_reserva,
                    fecha_entrada: item.fecha_entrada,
                    fecha_salida: item.fecha_salida,
                    hora_entrada: item.hora_entrada,
                    hora_salida: item.hora_salida,
                    precio: `Q${item.precio}`,
                    habitacion: item.room.tipo_habitacion,
                };
            });
            res.send(modifiedData);
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || 'Error al obtener las reservaciones del usuario.'
        });
    });
};

// Seleccionar la reservación por ID para el usuario autenticado
exports.findOne = (req, res) => {
    const userId = req.user.logeado.id;
    const id = req.params.id;

    Reservation.findOne({
        where: { id, userId } // Se busca la reserva por ID asociada al usuario autenticado
    })
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: `No se encuentra la reservación con el ID=${id} asociada a este usuario.`
            });
        } else {
            const modifiedData = {
                id: data.id,
                tipo_reserva: data.tipo_reserva,
                fecha_entrada: data.fecha_entrada,
                fecha_salida: data.fecha_salida,
                hora_entrada: data.hora_entrada,
                hora_salida: data.hora_salida,
                precio: `Q${data.precio}`,
                habitacion: data.room.tipo_habitacion,
            };
            res.send(modifiedData);
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error al obtener la reservación con ID=" + id + " para el usuario."
        });
    });
};

// Actualizar la reservación por ID para el usuario autenticado
exports.update = (req, res) => {
    const userId = req.user.logeado.id;

    // Lógica para buscar y actualizar la reserva asociada al usuario actual
    Reservation.update(req.body, {
        where: { userId } // Actualiza la reserva asociada al usuario autenticado
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: 'Reservación actualizada correctamente para este usuario.'
            });
        } else {
            res.send({
                message: 'No se encontró la reservación asociada a este usuario.'
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'Error al actualizar la reservación para este usuario.'
        });
    });
};

// Eliminar la reservación por ID para el usuario autenticado
exports.delete = (req, res) => {
    const userId = req.user.logeado.id;

    // Lógica para buscar y eliminar la reserva asociada al usuario actual
    Reservation.destroy({
        where: { userId } // Elimina la reserva asociada al usuario autenticado
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: 'Se eliminó la reservación correctamente para este usuario.'
            });
        } else {
            res.send({
                message: 'No se encontró la reservación asociada a este usuario.'
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'No se logró eliminar la reservación para este usuario.'
        });
    });
};
