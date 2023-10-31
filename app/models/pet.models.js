module.exports = (sequelize, Sequelize) => {
  const Pet = sequelize.define("pet", {
      nombre: {
          type: Sequelize.STRING
      },
      raza: {
          type: Sequelize.STRING
      },
      edad: {
          type: Sequelize.INTEGER
      },
      sexo: {
          type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id',      
        },
    }
  });
  return Pet;
};
