module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      nombre_producto: {
        type: Sequelize.STRING
      },
      marca: {
        type: Sequelize.STRING
      },
      precio: {
        type: Sequelize.DECIMAL(10,2)
      },
      stock: {
        type: Sequelize.INTEGER
      },
      disponibilidad: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Product;
  };
  