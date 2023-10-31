const jwt = require("jsonwebtoken");
exports.ensureAuth = function(req, res ,next) 
{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'})
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token);
        req.user = payload;
        console.log('Payload en ensureAuth:', payload); // Agregar este console.log para verificar el contenido del payload
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }

   // req.user = payload;

    next();
}