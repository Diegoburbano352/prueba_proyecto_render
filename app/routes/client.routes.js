module.exports = app => {
  const Client = require("../controller/client.controller.js");
  var router = require("express").Router();
  var aut = require ("../middlewares/autenticacion.js")

  // Crear un nuevo cliente
  router.post("/",aut.ensureAuth, Client.create);

  // Listar a todos los clientes
  router.get("/", aut.ensureAuth,Client.findAll);

  // Mostrar un solo cliente con su id
  router.get("/:id",aut.ensureAuth, Client.findOne);

  // Actualizar el cliente por id
  router.put("/:id",aut.ensureAuth,Client.update);

  // Eliminar el cliente por id
  router.delete("/:id",aut.ensureAuth,Client.delete);

  app.use("/api/client", router);
};
