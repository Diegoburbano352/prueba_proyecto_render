
module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define("reservation", {
    tipo_reserva: {
      type: Sequelize.STRING
    },
    fecha_entrada: {
      type: Sequelize.DATE
    },
    fecha_salida: {
      type: Sequelize.DATE
    },

    hora_entrada: {
      type: Sequelize.TIME
    },
    
    hora_salida: {
      type: Sequelize.TIME
    },
    precio: {
      type: Sequelize.DECIMAL(10, 2)
    },

    // Agrega un campo para la habitación
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms', 
        key: 'id', // Campo en la tabla de habitaciones que se usará como referencia
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'users', 
          key: 'id',      
      }
}
  });

  return Reservation;
};