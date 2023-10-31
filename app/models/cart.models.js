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
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reservations',
          key: 'id',
        },
      },
      serviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
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
      } else if (cartItem.reservationId) {
        const Reservation = await sequelize.models.reservation.findByPk(cartItem.reservationId);
        if (Reservation) {
          unitPrice = Reservation.precio;
        }
      } else if (cartItem.serviceId) {
        const Service = await sequelize.models.services.findByPk(cartItem.serviceId);
        if (Service) {
          unitPrice = Service.precio;
        }
      }
  
      cartItem.precio = unitPrice;
      cartItem.total = unitPrice * cartItem.cantidad;
    });
  
    return Cart;
  };
  