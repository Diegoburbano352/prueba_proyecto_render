module.exports = app => {
    const PetUser = require('../controller/pet_user.controller.js');
    var router = require('express').Router();
    const aut = require('../middlewares/autenticacion.js');
    const userAuth = require('../middlewares/userAuth.js');

    // Middleware de autenticación
    router.use(aut.ensureAuth);

    // Rutas para las operaciones de mascotas de usuarios normales

    // Crear una mascota para usuario
    router.post('/', aut.ensureAuth,PetUser.create);

    // Listar todas las mascotas del usuario
    router.get('/',aut.ensureAuth,PetUser.findAll);

    // Consultar una mascota por su ID
    router.get('/:id',aut.ensureAuth,PetUser.findOne);

    // Actualizar una mascota por su ID
    router.put('/:id',aut.ensureAuth,PetUser.update);

    // Eliminar una mascota por su ID
    router.delete('/:id',aut.ensureAuth,PetUser.delete);

    app.use('/api/pet_user', router);
};
