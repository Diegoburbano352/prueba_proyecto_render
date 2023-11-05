module.exports = app => {
    const Product = require("../controller/product.controller.js");
    var router = require("express").Router();
    var aut = require ("../middlewares/autenticacion.js")
  
    // Crear un nuevo producto
    router.post("/",aut.ensureAuth, Product.create);
  
    // Consultar todos los productos
    router.get("/", Product.findAll);
  
    // Consultar un solo producto por su id
    router.get("/:id", Product.findOne);
  
    // Actualizar un producto por su id
    router.put("/:id",aut.ensureAuth ,Product.update);
  
    // Eliminar un producto por su id
    router.delete("/:id",aut.ensureAuth, Product.delete);
  
    app.use("/api/product", router);
  };
  