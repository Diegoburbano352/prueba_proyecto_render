module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("room", {
      tipo_habitacion: {
        type: Sequelize.STRING
      },
      capacidad: {
        type: Sequelize.STRING
      },
      comodidades: {
        type: Sequelize.STRING
      },
      estado_disponibilidad: {
        type: Sequelize.BOOLEAN
      },
      tarifa: {
        type: Sequelize.INTEGER
      }
    });
  
    return Room;
  };
  