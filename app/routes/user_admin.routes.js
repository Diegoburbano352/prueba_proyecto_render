module.exports = app => {
    const Useradmin = require("../controller/user_admin.controller.js");
    const aut = require("../middlewares/autenticacion.js");
    var router = require("express").Router();


    // Consultar todos los usuarios
    router.get("/", aut.ensureAuth, Useradmin.findAll);

    // Actualizar usuario por su id 
    router.put("/:id", aut.ensureAuth, Useradmin.update);

    // Eliminar un usuario por su id
    router.delete("/:id", aut.ensureAuth, Useradmin.delete);

    app.use("/api/user_admin", router);
};
