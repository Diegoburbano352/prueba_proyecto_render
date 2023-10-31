module.exports = app => {
    const Employee = require("../controller/employee.controller.js");
    var router = require("express").Router();
    var aut = require ("../middlewares/autenticacion.js")

    // Crear un nuevo empleado
    router.post("/", aut.ensureAuth,Employee.create);
  
    // Listar todos los empleados
    router.get("/",aut.ensureAuth ,Employee.findAll);
  
    // Mostrar solo el empleado por id
    router.get("/:id", aut.ensureAuth,Employee.findOne);
  
    // Actualizar el empleado por id
    router.put("/:id", aut.ensureAuth,Employee.update);
  
    // Eliminar el empleado por id
    router.delete("/:id",aut.ensureAuth,Employee.delete);
  
    app.use("/api/employee", router);
  };
  