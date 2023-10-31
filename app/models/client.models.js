module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      nit: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Client;
  };
  