//importing modules
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const User = db.users;
const { Op } = require('sequelize');

// signing a user up
// hashing user's password before saving it to the database with bcrypt
const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Verifica si los campos obligatorios están presentes
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "Ingrese los datos de userName, email y password, ya que todos los campos son obligatorios" });
    }
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
     rol: "usuario",
    };

    // Guarda el usuario si todos los campos requeridos están presentes
    const user = await User.create(data);

    // Si los detalles del usuario se capturan con éxito
    // genera un token con el id del usuario y la clave secreta en el archivo de entorno
    // establece una cookie con el token generado
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      // Envía los detalles del usuario
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Los detalles no son correctos");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

//login authentication

const login = async (req, res) => {
 try {
const { email, password } = req.body;

   //find a user by their email
   const user = await User.findOne({
     where: {
     email: email
   } 
     
   });

   //if user email is found, compare password with bcrypt
   if (user) {
     const isSame = await bcrypt.compare(password, user.password);
     //if password is the same
      //generate token with the user's id and the secretKey in the env file

     if (isSame) {
       let token = jwt.sign({ logeado: user }, process.env.secretKey, {
         expiresIn: 1 * 24 * 60 * 60 * 1000,
       });

       //if password matches wit the one in the database
       //go ahead and generate a cookie for the user
       res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
       console.log("user", JSON.stringify(user, null, 2));
       console.log(jwt.decode(token));

       //send user data
       return res.status(201).send(token);
     } else {
       return res.status(401).send("Contraseña incorrecta");
     }
   } else {
     return res.status(401).send("Email no encontrado, asegurese de que tenga una cuenta o verifique que el email este bien escrito"); 
   }
 } catch (error) {
   console.log(error);
 }
};

module.exports = {
 signup,
 login,
};