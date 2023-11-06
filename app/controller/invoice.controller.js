const db = require('../models');
const Factura = db.factura;


// Crear factura a partir de la vista del carrito
exports.createFacturaFromCartView = async (req, res) => {
    try {
      let cartItems = req.body.cartItems;
      console.log(req.body);
      console.log(cartItems);
      if (!Array.isArray(cartItems)) {
        // Si los datos no son un arreglo, conviértelos a un arreglo de un solo elemento
        cartItems = [cartItems];
      }
      let detalle = '' 
      const facturaItems = cartItems.map(item => {
        detalle += `\n ${item.product.nombre_producto}--precio:${item.precio}`;
        return {
          itemName: item.product,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        };
      });
  
      const userId = req.user.logeado.id;

      const newFactura = await Factura.create({
        numeroFactura: generateInvoiceNumber(),
        fechaEmision: new Date(),
        facturadetalles: facturaItems,
        userId: userId,
        total: req.body.totalPrice,
        detalle: detalle, 
      });
  
      return res.status(201).send('Factura creada a partir de los datos del carrito');
    } catch (error) {
      console.error(error);
      return res.status(500).send(req.body);
    }
  
    function generateInvoiceNumber() {
        const randomNumber = Math.floor(Math.random() * 100000); // Generar un número aleatorio
        return randomNumber;
    }
  };
  

// Obtener facturas por el ID del usuario
exports.getFacturasByUserId = async (req, res) => {
    try {
      const userId = req.user.logeado.id;

      if (!userId) {
        return res.status(404).send('ID de usuario no disponible');
      }
  
      const facturas = await Factura.findAll({ where: { userId } });
  
      if (!facturas || facturas.length === 0) {
        return res.status(404).send('No se encontraron facturas para este usuario');
      }
  
      return res.status(200).send(facturas);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error interno del servidor al obtener las facturas');
    }
  };
  