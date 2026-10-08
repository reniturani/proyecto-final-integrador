const Profesor = require('../models/profesores.js');
const Materia = require('../models/materia.js');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); 

// GET: obtener todos los profesores (con paginacion, busqueda por nombre, filtrado por modalidad y materia, y ordenamiento)
const obtenerProfesores = async (req, res) => {
    try {
        // extraigo los parametros de la url. les di valores por defecto si no vienen
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'id_profesor'; // ordena por ID por defecto
        const order = req.query.order || 'ASC';
        
        const { modalidad, materia, nombre } = req.query; 

        // calcula cuantos registros saltearse segun la pagina
        const offset = (page - 1) * limit;

        let whereCondition = {};
        
        // validar y aplicar filtro de modalidad
        if (modalidad !== undefined) {
            if (!modalidad.trim()) {
                return res.status(400).json({ mensaje: 'La modalidad no puede estar vacía' });
            }
            if (!await Profesor.findOne({ where: { modalidad } })) {
                return res.status(404).json({ mensaje: 'La modalidad no existe' });
            }
            whereCondition.modalidad = modalidad;
        }

        // busqueda por nombre 
        if (nombre) {
            whereCondition.nombre = {
                [Op.like]: `%${nombre}%` 
            };
        }

        // validamos que la materia exista si la enviaron
        if (materia !== undefined) {
            if (!materia.trim()) {
                return res.status(400).json({ mensaje: 'La materia no puede estar vacía' });
            }
            if (!await Materia.findOne({ where: { nombre: materia } })) {
                return res.status(404).json({ mensaje: 'La materia no existe' });
            }
        }

        // ejecuta la consulta con findAndCountAll (trae los datos y el total de registros)
        const { count, rows } = await Profesor.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [[sortBy, order.toUpperCase()]], // ordenamiento
            attributes: { exclude: ['password'] },
            include: materia ? [{
                model: Materia,
                where: { nombre: materia },
            }] : []
        });

        // si no hay resultados
        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontraron profesores para los filtros indicados'
            });
        }

        // respuesta con la estructura paginada
        res.status(200).json({
            totalRegistros: count,
            totalPaginas: Math.ceil(count / limit),
            paginaActual: page,
            profesores: rows
        });

    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ mensaje: 'Error interno al cargar la lista' });
    }
};

// GET: obtener un profesor especifico por su ID
const obtenerProfesorPorId = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const profesor = await Profesor.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        // si mandan un ID que no existe, devolvemos un error 404 not found
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        res.status(200).json(profesor);
    } catch (error) {
        console.error('Error al obtener el profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al buscar el profesor' });
    }
};

// POST: crear un nuevo profesor
const crearProfesor = async (req, res) => {
    try {
        const { nombre, apellido, email, password, descripcion, precio_hora, modalidad, ubicacion, foto_url } = req.body;

        // validacion basica
        if (!nombre || !apellido || !email || !password || !descripcion || !precio_hora || !modalidad) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        // validacion: el precio no puede ser menor a 0
        if (precio_hora < 0) {
            return res.status(400).json({ mensaje: 'El precio por hora no puede ser negativo' });
        }

        // encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // guardar en la base de datos
        const nuevoProfesor = await Profesor.create({
            nombre, apellido, email, password: hashedPassword, descripcion, precio_hora, modalidad, ubicacion, foto_url
        });

        res.status(201).json({ 
            mensaje: 'Profesor creado con éxito', 
            profesor: { id_profesor: nuevoProfesor.id_profesor, nombre: nuevoProfesor.nombre, email: nuevoProfesor.email } 
        });
    } catch (error) {
        console.error('Error al crear profesor:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }
        res.status(500).json({ mensaje: 'Error interno al crear el profesor' });
    }
};

// PUT: actualizar un profesor existente
const actualizarProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, password, descripcion, precio_hora, modalidad, ubicacion, foto_url } = req.body;
        
        // validacion: si ingresan un precio, que no sea negativo
        if (precio_hora !== undefined && precio_hora < 0) {
            return res.status(400).json({ mensaje: 'El precio por hora no puede ser negativo' });
        }

        const profesor = await Profesor.findByPk(id);
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        // si envian una nueva contraseña, la encriptamos, y si no conservamos la actual
        let hashedPassword = profesor.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // actualizamos los campos (si no mandan un dato nuevo, conservamos el que ya tenía en la BD)
        await profesor.update({
            nombre: nombre || profesor.nombre,
            apellido: apellido || profesor.apellido,
            email: email || profesor.email,
            password: hashedPassword,
            descripcion: descripcion || profesor.descripcion,
            precio_hora: precio_hora || profesor.precio_hora,
            modalidad: modalidad || profesor.modalidad,
            ubicacion: ubicacion || profesor.ubicacion,
            foto_url: foto_url || profesor.foto_url
        });

        res.status(200).json({ mensaje: 'Profesor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al actualizar el profesor' });
    }
};

// DELETE: eliminar un profesor
const eliminarProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const profesor = await Profesor.findByPk(id);

        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        await profesor.destroy();
        res.status(200).json({ mensaje: 'Profesor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al eliminar el profesor' });
    }
};

// exportamos las funciones
module.exports = {
    obtenerProfesores,
    obtenerProfesorPorId,
    crearProfesor,
    actualizarProfesor,
    eliminarProfesor
};