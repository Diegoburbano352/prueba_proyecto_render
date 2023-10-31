module.exports = app => {
  const cartController = require("../controller/cart.controller.js");
  const aut = require('../middlewares/autenticacion.js');
  const userAuth = require('../middlewares/userAuth.js');
  var router = require("express").Router();

  // Middleware de autenticación
  router.use(aut.ensureAuth);  

  // Agregar elementos al carrito
  router.post("/add", cartController.addToCart);

  // Ver el contenido del carrito
  router.get("/view", cartController.viewCart);

  // Eliminar elementos del carrito
  router.delete("/remove/:id", cartController.removeFromCart);

  // Calcular el total del carrito
  router.get("/total", cartController.calculateTotal);

  app.use("/api/cart", router);
};
