module.exports = app => {
    const Pet = require('../controller/pet.controller.js');
    var router = require('express').Router();
    var aut = require ("../middlewares/autenticacion.js")

    router.post('/',aut.ensureAuth,Pet.create);
    router.get('/',aut.ensureAuth ,Pet.findAll);
    router.get('/:id',aut.ensureAuth, Pet.findOne);
    router.put('/:id',aut.ensureAuth, Pet.update);
    router.delete('/:id',aut.ensureAuth,Pet.delete);

    app.use('/api/pet', router);
};