module.exports = app => {
    const Room = require('../controller/room.controller.js');
    var router = require('express').Router();
    var aut = require ("../middlewares/autenticacion.js")

    router.post('/',aut.ensureAuth, Room.create);
    router.get('/', Room.findAll);
    router.get('/:id' ,Room.findOne);
    router.put('/:id', aut.ensureAuth,Room.update);
    router.delete('/:id',aut.ensureAuth,Room.delete);

    app.use('/api/room', router);
};