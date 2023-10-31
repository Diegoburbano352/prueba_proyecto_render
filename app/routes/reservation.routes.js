module.exports = app => {
    const Reservation = require('../controller/reservation.controller.js');
    var router = require('express').Router();
    var aut = require ("../middlewares/autenticacion.js")

    router.post('/', Reservation.create);
    router.get('/', aut.ensureAuth,Reservation.findAll);
    router.get('/:id', aut.ensureAuth,Reservation.findOne);
    router.put('/:id',aut.ensureAuth,Reservation.update);
    router.delete('/:id',aut.ensureAuth,Reservation.delete);
    
    app.use('/api/reservation', router);
};