const db = require('../models');
const Cart = db.cart;
const Product = db.product;
const Reservation = db.reservation;
const Service = db.service;

module.exports = exports;

// Agregar elementos al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, reservationId, serviceId, cantidad, precio, total} = req.body; // Modifica quantity a cantidad
    const userId = req.user.logeado.id;

    if (cantidad && userId) { // Actualiza quantity a cantidad
      let total = 0;

      if (productId) {
        const product = await Product.findByPk(productId);
        if (product) {
          total = product.precio * cantidad; // Modifica quantity a cantidad
        } else {
          return res.status(404).send('Producto no encontrado');
        }
      } else if (reservationId) {
        const reservation = await Reservation.findByPk(reservationId);
        if (reservation) {
          total = reservation.precio * cantidad; // Modifica quantity a cantidad
        } else {
          return res.status(404).send('Reserva no encontrada');
        }
      } else if (serviceId) {
        const service = await Service.findByPk(serviceId);
        if (service) {
          total = service.precio * cantidad; // Modifica quantity a cantidad
        } else {
          return res.status(404).send('Servicio no encontrado');
        }
      } else {
        return res.status(400).send('Por favor, proporciona datos válidos para agregar al carrito.');
      }

      const cartItem = await Cart.create({
        userId,
        productId,
        reservationId,
        serviceId,
        cantidad: cantidad, // Modifica cantidad a cantidad
        precio: 0, // Esto se calculará en el hook 'beforeCreate'
        total: total
      });

      return res.status(201).send('Elemento agregado al carrito correctamente');
    } else {
      return res.status(400).send('Por favor, proporciona datos válidos para agregar al carrito.');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};


// Ver el contenido del carrito
exports.viewCart = async (req, res) => {
  try {
    const userId = req.user.logeado.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      attributes: ['productId', 'reservationId', 'serviceId', 'cantidad'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['nombre_producto', 'precio'],
        },
        {
          model: Reservation,
          as: 'reservation',
          attributes: ['tipo_reserva', 'precio'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['servicio', 'precio'],
        },
      ],
    });

    const formattedCartItems = cartItems.map(item => {
      let precio = 0;
      let total = 0;

      if (item.product) {
        precio = item.product.precio;
      } else if (item.reservation) {
        precio = item.reservation.precio;
      } else if (item.service) {
        precio = item.service.precio;
      }

      total = precio * item.cantidad;

      const formattedItem = {
        cantidad: item.cantidad,
        precio,
        total,
      };

      if (item.product) {
        formattedItem.product = item.product.nombre_producto;
      }

      if (item.reservation) {
        formattedItem.reservation = item.reservation.tipo_reserva;
      }

      if (item.service) {
        formattedItem.service = item.service.servicio;
      }

      return formattedItem;
    });

    return res.status(200).send(formattedCartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};

// Eliminar elementos del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user.logeado.id;

    await Cart.destroy({
      where: { id: cartItemId, userId },
    });

    return res.status(204).send('Elemento del carrito eliminado correctamente');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};

// Calcular el total del carrito de un usuario específico
exports.calculateTotal = async (req, res) => {
  try {
    const userId = req.user.logeado.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['precio'],
        },
        {
          model: Reservation,
          as: 'reservation',
          attributes: ['precio'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['precio'],
        },
      ],
    });

    let totalPrice = 0;

    for (const item of cartItems) {
      let precio = 0;

      if (item.product) {
        precio = item.product.precio;
      } else if (item.reservation) {
        precio = item.reservation.precio;
      } else if (item.service) {
        precio = item.service.precio;
      }

      totalPrice += precio * item.cantidad;
    }

    return res.status(200).send({ totalPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};