const db = require('../models');
const Pet= db.pet;
const Op = db.Sequelize.Op;

//crear y guardar mascota
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        if (!req.body.nombre) {
            res.status(404).send({
                message: 'Complete el campo del nombre ya que no puede estar vacio'
            });               
             return;
        }
        
    const idUsuario = req.user.logeado.id;
    console.log(req.user);
        const mascota = {
            nombre: req.body.nombre,
            raza: req.body.raza,
            edad: req.body.edad,
            sezo: req.body.sexo ? req.body.sexo :true,
            userId: idUsuario
        };
    
        Pet.create(mascota)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear las mascora en la bd'
                });
            });
    }   
};


//consulta de mascota  por nombre o listar todas las mascotas
exports.findAll = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const nombre = req.body.nombre;
        var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
    
        Pet.findAll({ where: condition })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener las mascota'
                });
            });
    }
    };
    
    // buscar la mascota por id
    exports.findOne = (req, res) => {       
        const id = req.params.id;
    
        Pet.findByPk(id)
            .then(data => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `no se encuentra la mascota con id=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al obtener la mascota con id=" + id
                });
            });
    };
    
    // Consultar la mascota por nombre
    exports.findByName = (req, res) => {
        let usuariologeado = req.user.logeado
        if (usuariologeado.rol==="usuario"){
            res.status(403).send({
                message: 'No tiene el rol necesario'
            });            
        }else{
            const nombre = req.params.nombre; // Utiliza req.params.nombre en lugar de req.params.id
    
            var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
        
            Pet.findAll({ where: condition })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Error al obtener la mascota por nombre, asegurese de que sea el nombre correcto de la mascota'
                    });
                });
        }         
};


//Actualizar la mascota por el id
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Pet.update(req.body, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'mascota actualizada correctamente'
                    });
                } else {
                    res.send({
                        message: `'No se encontro la mascota con el id: ${id}, o no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al actualizar la mascota con id=" + id
                });
            });
    }
};

exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Pet.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: ' Se elimino la mascota correctamente'
                    });
                } else {
                    res.send({
                        message: `'el  id de la mascota : ${id} no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se pudo eliminar la mascota con el  id=" + id
                });
            });
    }    
};
