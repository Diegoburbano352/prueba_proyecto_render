const db = require('../models');
const Client= db.client;
const Op = db.Sequelize.Op;

//crear y guardar cliente
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {

        if (!req.body.nombre) {
            res.status(404).send({
                message: 'el contenido del nombre no puede estar vacio'
            });
            return;
        }
        //Creacion del cliente
        const client = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            direccion: req.body.direccion,
            nit: req.body.nit,
            telefono: req.body.telefono,
            email: req.body.email,
            estado: req.body.estado ? req.body.estado :true
        };
    
        Client.create(client)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear el cliente en la bd'
                });
            });
    }
};


//consulta de clientes por nombre o listar todos los clientes
exports.findAll = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const nombre = req.query.nombre; // Usa req.query en lugar de req.body para parámetros GET
        var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
    
        Client.findAll({ where: condition })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener el cliente'
                });
            });
    }
    };


    exports.findOne = (req, res) => {
        if (usuariologeado.rol==="usuario"){
            res.status(403).send({
                message: 'No tiene el rol necesario'
            });            
        }else {
            const id = req.params.id;
            Client.findByPk(id)
                .then(data => {
                    if (data) {
                        res.send(data);
                    } else {
                        res.status(404).send({
                            message: `no se encuentra el cliente con id=${id}.`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error al obtener el cliente con id=" + id
                    });
                });
        }
    };
        


exports.findByName = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const nombre = req.params.nombre; // Utiliza req.params.nombre en lugar de req.params.id
        var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
        Client.findAll({ where: condition })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener el cliente por nombre, asegurese de que sea el nombre correcto del cliente'
                });
            });
    }
};



// Actualizar un cliente
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Client.update(req.body, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'cliente actualizado correctamente'
                    });
                } else {
                    res.send({
                        message: `'No se encontro el cliente con el id: ${id}, o no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al actualizar el cliente con id=" + id
                });
            });
    }
};

exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario" | usuariologeado.rol==="empleado") {
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Client.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: ' Se elimino el cliente  correctamente'
                    });
                } else {
                    res.send({
                        message: `'el  id del cliente : ${id} no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se logro eliminar el cliente con id=" + id
                });
            });
    }
};