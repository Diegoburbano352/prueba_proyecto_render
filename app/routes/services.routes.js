module.exports = app => {
    const Service = require('../controller/services.controller.js');
    var router = require('express').Router();
    var aut = require ("../middlewares/autenticacion.js")

    router.post('/',aut.ensureAuth, Service.create);
    router.get('/', Service.findAll);
    router.get('/:id', Service.findOne);
    router.put('/:id',aut.ensureAuth,Service.update);
    router.delete('/:id',aut.ensureAuth,Service.delete);

    app.use('/api/services', router);
};