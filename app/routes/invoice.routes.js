// En tu archivo de rutas para las facturas
module.exports = app => {
    const Factura = require("../controller/invoice.controller.js");
    const aut = require('../middlewares/autenticacion.js');
    const userAuth = require('../middlewares/userAuth.js');
    var router = require("express").Router();
  
 // Middleware de autenticación
 router.use(aut.ensureAuth);  

// Obtener facturas por ID de usuario
 router.get("/view", Factura.getFacturasByUserId);

// Crear factura a partir de la vista del carrito
router.post("/create",  Factura.createFacturaFromCartView);
  
    app.use("/api/invoice", router);
};






