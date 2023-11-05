module.exports = (sequelize, Sequelize) => {
const Product = require('./product.models');
const Reservation = require('./reservation.models');
const Service = require('./services.models');
    const Cart = sequelize.define("cart",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      }
    });
  
    Cart.beforeCreate(async (cartItem, options) => {
      let unitPrice = 0;
  
      if (cartItem.productId) {
        const Product = await sequelize.models.product.findByPk(cartItem.productId);
        if ( Product) {
          unitPrice = Product.precio;
        }
      }
  
      cartItem.precio = unitPrice;
      cartItem.total = unitPrice * cartItem.cantidad;
    });
  
    return Cart;
  };
  