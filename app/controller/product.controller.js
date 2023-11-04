const db = require('../models');
const Product= db.product;
const Op = db.Sequelize.Op;

// Crear y guardar el producto, con la validación de que solo el administrador puede crear nuevos productos
exports.create = (req, res) => {
    let usuariologeado = req.user.logeado;

    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });
    } else {
        if (!req.body.nombre_producto) {
            res.status(403).send({
                message: 'El contenido del nombre del producto no puede estar vacío'
            });
            return;
        }

        // Creación del producto
        const product = {
            nombre_producto: req.body.nombre_producto,
            marca: req.body.marca,
            precio: req.body.precio,
            stock: req.body.stock,
            disponibilidad: req.body.disponibilidad ? req.body.disponibilidad : true
        };

        // Creación del producto en la base de datos
        Product.create(product)
            .then(data => {
                res.status(201).send({
                    message: 'Producto creado con éxito',
                    data: data
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Error al crear el producto en la base de datos'
                });
            });
    }
};


//consulta del producto por nombre o listar todos los productos
exports.findAll = (req, res) => {
    const nombre_producto = req.query.nombre_producto; // Usa req.query para obtener el parámetro de consulta
    var condition = nombre_producto ? { nombre_producto: { [Op.iLike]: `%${nombre_producto}%` } } : null;
    Product.findAll({ where: condition })
        .then(data => {
            if (data.length === 0) {
                if (!nombre_producto) {
                    return res.status(404).send({ message: 'No hay productos disponibles.' });
                }
                const message = `No se encontraron productos con el nombre '${nombre_producto}'.`;
                return res.status(404).send({ message });
            } else {
                // Realiza una transformación de los datos para mostrar "Agotado" en lugar de true/false
                const transformedData = data.map(product => ({
                    id: product.id,
                    nombre_producto: product.nombre_producto,
                    marca: product.marca,
                    precio: `Q${parseFloat(product.precio).toFixed(2)}`, // Formatea el precio a Qxx.xx
                    stock: product.stock,
                    disponibilidad: product.disponibilidad ? 'Disponible' : 'Agotado'
                }));
                res.send(transformedData);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al obtener los productos'
            });
        });
};


//Buscar el productos por id 
exports.findOne = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `no se encuentra el producto con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el cliente con id=" + id
            });
        });
};


// Actualizar el producto por el ID, vista protegida por rol, el rol de usuario y empleado no pueden ingresar, solo el rol de administrador
exports.update = (req, res) => {
    let usuariologeado = req.user.logeado;
    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });
    } else {
        const id = req.params.id;
        Product.update(req.body, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'Producto actualizado correctamente'
                    });
                } else {
                    res.status(404).send({
                        message: `No se encontró el producto con el ID: ${id}, o no existe`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al actualizar el producto con ID=" + id
                });
            });
    }
};

// Eliminar el producto por ID, vista protegida por rol, rol usuario y empleado no puede ingresar, solo el rol administrador
exports.delete = (req, res) => {
    let usuariologeado = req.user.logeado;
    if (usuariologeado.rol === "usuario" || usuariologeado.rol === "empleado") {
        res.status(403).send({
            message: 'No tiene el rol necesario'
        });
    } else {
        const id = req.params.id;
        Product.destroy({
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'Se eliminó el producto correctamente'
                    });
                } else {
                    res.status(404).send({
                        message: `El ID del producto: ${id} no existe`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se logró eliminar el producto con ID=" + id
                });
            });
    }
};
