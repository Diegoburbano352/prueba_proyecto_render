module.exports = (sequelize, Sequelize) => {
const Factura = require('./invoice.models');
const FacturaDetalle = sequelize.define('facturadetalle', {
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    precioUnitario: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }

  });
  
  FacturaDetalle.associate = (models) => {
    FacturaDetalle.belongsTo(models.Factura);
  };
  
  return FacturaDetalle;
  
  };