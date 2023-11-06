module.exports = (sequelize, Sequelize) => {
const Factura = sequelize.define('factura', {
    numeroFactura: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    fechaEmision: {
      type: Sequelize.DATE,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      }
      },
      total: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        },
        detalle: {
          type: Sequelize.STRING,
          allowNull: true,
          }
  });  
  return Factura;
  
  };