const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const dbConfig = require("../config/db.config.js");

const app = express();


// Crear una instancia de Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar tus modelos y asociarlos con la instancia de Sequelize
db.client = require("./client.models.js")(sequelize, Sequelize);
db.pet = require("./pet.models.js")(sequelize, Sequelize);
db.reservation = require("./reservation.models.js")(sequelize, Sequelize);
db.room = require("./room.models.js")(sequelize, Sequelize);
db.service = require("./services.models.js")(sequelize, Sequelize);
db.employee = require("./employee.models.js")(sequelize, Sequelize);
db.product = require("./product.models.js")(sequelize, Sequelize);
db.users = require("./userModel.js")(sequelize, Sequelize); 
db.cart = require("./cart.models.js")(sequelize,Sequelize);
db.factura = require("./invoice.models.js")(sequelize,Sequelize);
db.facturadetalle = require("./invoice_detail.models.js")(sequelize,Sequelize);

// Establece las asociaciones en reservation con la de room
db.room.hasMany(db.reservation, { foreignKey: 'roomId' });
db.reservation.belongsTo(db.room, { foreignKey: 'roomId' });

// Establece las asociaciones en Pet con la de User
db.users.hasMany(db.pet, { foreignKey: 'userId' });
db.pet.belongsTo(db.users, { foreignKey: 'userId' });

// Establece las asociaciones en Reservation con la tabla de user.
db.users.hasMany(db.reservation, { foreignKey: 'userId' });
db.reservation.belongsTo(db.users, { foreignKey: 'userId' });

// Establece las asociaciones del carrito
db.users.hasMany(db.cart, { foreignKey: 'userId' });
db.product.hasMany(db.cart, { foreignKey: 'productId' });
db.reservation.hasMany(db.cart, { foreignKey: 'reservationId' });
db.service.hasMany(db.cart, { foreignKey: 'serviceId' });

db.cart.belongsTo(db.users, { foreignKey: 'userId' });
db.cart.belongsTo(db.product, { foreignKey: 'productId' });
db.cart.belongsTo(db.reservation, { foreignKey: 'reservationId' });
db.cart.belongsTo(db.service, { foreignKey: 'serviceId' });

// Establece las asociaciones de la factura
db.users.hasMany(db.factura, { foreignKey: 'userId' });
db.factura.belongsTo(db.users, { foreignKey: 'userId' });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

module.exports = db;