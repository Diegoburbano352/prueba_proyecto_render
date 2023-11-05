module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
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
      salario: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      puesto: {
        type: Sequelize.STRING
      },
      fecha_contratacion: {
        type: Sequelize.DATE
      },
      Genero: {
        type: Sequelize.BOOLEAN
      }
    });
    return Employee;
  };
  