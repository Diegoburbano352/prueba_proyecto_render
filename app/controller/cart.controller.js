const db = require('../models');
const Cart = db.cart;
const Product = db.product;
const Reservation = db.reservation;
const Service = db.service;

module.exports = exports;

// Agregar elementos al carrito
exports.addToCart = async (req, res) => {
  let transaction;
  try {
    const { productId, cantidad } = req.body;
    const userId = req.user.logeado.id;

    transaction = await db.sequelize.transaction();

    if (cantidad && userId) {
      const product = await Product.findByPk(productId, { transaction });

      if (product) {
        if (product.stock >= cantidad) {
          await Cart.create(
            {
              userId,
              productId,
              cantidad,
              precio: product.precio,
            },
            { transaction }
          );

          await Product.update(
            { stock: product.stock - cantidad },
            {
              where: { id: productId },
              transaction,
            }
          );

          await transaction.commit();
          return res.status(201).send('Elemento agregado al carrito correctamente');
        } else {
          return res.status(400).send('Cantidad insuficiente en el stock');
        }
      } else {
        return res.status(404).send('Producto no encontrado');
      }
    } else {
      return res.status(400).send('Proporciona datos válidos para agregar al carrito');
    }
  } catch (error) {
    console.error(error);
    if (transaction) await transaction.rollback();
    return res.status(500).send('Error interno del servidor');
  }
};



// Ver el contenido del carrito
exports.viewCart = async (req, res) => {
  try {
    const userId = req.user.logeado.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      attributes: ['productId','cantidad'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['nombre_producto', 'precio'],
        }
      ],
    });

    const formattedCartItems = cartItems.map(item => {
      let precio = 0;
      let total = 0;

      if (item.product) {
        precio = item.product.precio;
      }

      total = precio * item.cantidad;

      const formattedItem = {
        cantidad: item.cantidad,
        precio,
      };

      if (item.product) {
        formattedItem.product = item.product.nombre_producto;
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
          attributes: ['precio','nombre_producto'],
        }
      ],
    });

    let totalPrice = 0;

    for (const item of cartItems) {
      let precio = 0;

      if (item.product) {
        precio = item.product.precio;
      }

      totalPrice += precio * item.cantidad;
    }

    return res.status(200).send({ cartItems,totalPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};