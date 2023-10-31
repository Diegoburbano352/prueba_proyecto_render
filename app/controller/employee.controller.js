const db = require('../models');
const Employee= db.employee;
const Op = db.Sequelize.Op;

//crear y guardar empleado
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"|usuariologeado.rol==="empleado"){
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
        //Creacion del empleado
        const employee = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            direccion: req.body.direccion,
            nit: req.body.nit,
            salrio: req.body.salario,
            telefono: req.body.telefono,
            email: req.body.email,
            puesto: req.body.puesto,
            fecha_contratacion: req.body.fecha_contratacion,
            genero: req.body.genero ? req.body.genero :true
        };
    
    // Crea el empleado
        Employee.create(employee)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear el empleado en la bd'
                });
            });
    }
};


//consulta de empleado por nombre o listar todos los empleados
exports.findAll = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"|usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const nombre = req.query.nombre; // Usa req.query en lugar de req.body para parámetros GET
        var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;
        Employee.findAll({ where: condition })
            .then(data => {
                if (data.length === 0) {
                    if (!nombre) {
                        // Si no se proporciona un nombre y no hay empleados, se muestra el mensaje de error
                        return res.status(404).send({ message: 'No hay empleados disponibles.' });
                    }
    
                    const message = `No se encontraron empleados con el nombre '${nombre}'.`;
                    return res.status(404).send({ message });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al obtener los empleados'
                });
            });
    }
};


//Buscar el empleado por id 
exports.findOne = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"|usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Employee.findByPk(id)
            .then(data => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `no se encuentra el empleado con id=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al obtener el empleado con id=" + id
                });
            });
    }
};

// Actualizar el empleado por el id 
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"|usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Employee.update(req.body, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'empleado actualizado correctamente'
                    });
                } else {
                    res.send({
                        message: `'No se encontro el empleado con el id: ${id}, o no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al actualizar el empleado con id=" + id
                });
            });
    }
};

// Eliminar el empleado por id
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado
    if (usuariologeado.rol==="usuario"| usuariologeado.rol==="empleado"){
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });            
    }else {
        const id = req.params.id;
        Employee.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: ' Se elimino el empleado  correctamente'
                    });
                } else {
                    res.send({
                        message: `'el  id del empleado : ${id} no existe'`
                    });
                };
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se logro eliminar el empleado con id=" + id
                });
            });
    }
};