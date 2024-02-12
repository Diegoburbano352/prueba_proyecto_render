const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./app/routes/userRoutes');
const app = express();
const db = require('./app/models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var corsOptions = {
  origin: "https://front-ie15.onrender.com"
};

db.sequelize.sync({ force: false }).then(() => {
  console.log("La base de datos ha sido reiniciada (force: true)");
});

app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a nuestra página." });
});

require("./app/routes/client.routes")(app);
require("./app/routes/pet.routes")(app);
require("./app/routes/pet_user.routes")(app);
require("./app/routes/reservation.routes")(app);
require("./app/routes/room.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/invoice.routes")(app);
require("./app/routes/client_user.routes")(app);
require("./app/routes/reservation_user.routes")(app);
require("./app/routes/user_admin.routes")(app);

// Configuración para manejar las rutas en React
const root = path.join(__dirname, 'build');

// Middleware para manejar las rutas en React antes de la ruta '*' (Wildcard)
app.use(express.static(root));

// Ruta para manejar todas las demás solicitudes y devolver la página principal de React
app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El servidor está ejecutándose en el puerto ${PORT}.`);
});
