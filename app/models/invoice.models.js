module.exports = (sequelize, Sequelize) => {
const FacturaDetalle = require('./invoice_detail.models'); 
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
      }
  });
  
  Factura.associate = (models) => {
    Factura.hasMany(models.FacturaDetalle);
  };
  
  return Factura;
  
  };