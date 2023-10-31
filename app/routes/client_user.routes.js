module.exports = app => {
    const ClientUserController = require('../controller/client_user.controller.js');
    const Client = require('../controller/client_user.controller.js');
    var router = require('express').Router();
    const aut = require('../middlewares/autenticacion.js');
    const userAuth = require('../middlewares/userAuth.js');

    // Middleware de autenticación
    router.use(aut.ensureAuth);

    // Crear un cliente para usuario
    router.post('/', aut.ensureAuth, Client.create); 

    // Obtener el cliente del usuario autenticado
    router.get('/', aut.ensureAuth, ClientUserController.getMyClient); 

    // Actualizar el cliente por su ID
    router.put('/', aut.ensureAuth, ClientUserController.updateMyClient); 

    // Eliminar el cliente asociado al usuario
    router.delete('/', aut.ensureAuth, ClientUserController.deleteMyClient); 

    app.use('/api/client_user', router); 
};
