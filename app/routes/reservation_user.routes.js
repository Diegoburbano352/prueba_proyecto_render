module.exports = app => {
    const Reservationuser = require('../controller/reservation_user.controller.js');
    var router = require('express').Router();
    const aut = require('../middlewares/autenticacion.js');

    // Middleware de autenticación
    router.use(aut.ensureAuth);

    //Ruta para que el usuario cree la reservacion 
    router.post('/create', aut.ensureAuth,Reservationuser.create);

    // Ruta para que el usuario vea su reserva
    router.get('/view', aut.ensureAuth,Reservationuser.findAll);

    // Buscar por medio de id la reservacion
     router.get('/:id', aut.ensureAuth,Reservationuser.findOne);


    // Ruta para actualizar la reserva del usuario
    router.put('/update', aut.ensureAuth,Reservationuser.update);

    // Ruta para eliminar la reserva del usuario
    router.delete('/eliminar', aut.ensureAuth,Reservationuser.delete);

    app.use('/api/reservation_user', router);

};
