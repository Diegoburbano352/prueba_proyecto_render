module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define("service", {
      servicio: {
        type: Sequelize.STRING
      },
      precio: {
        type: Sequelize.DECIMAL(10,2)
      },
      disponible: {
        type: Sequelize.BOOLEAN
      },
    });
  
    return Service;
  };
  