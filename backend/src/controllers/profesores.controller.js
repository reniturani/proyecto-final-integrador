const Profesor = require('../models/profesores.js');
const Materia = require('../models/materia.js');
const bcrypt = require('bcrypt');

// GET: obtener todos los profesores
const obtenerProfesores = async (req, res) => {
    try {
        // obtenemos la modalidad y/o materia de la consulta si es que se enviaron
        const { modalidad, materia } = req.query; 

        // validar que los filtros no estén vacíos
        if (modalidad !== undefined && !modalidad.trim()) {
            return res.status(400).json({ mensaje: 'La modalidad no puede estar vacía' });
        }

        if (materia !== undefined && !materia.trim()) {
            return res.status(400).json({ mensaje: 'La materia no puede estar vacía' });
        }

        // validar que existan
        if (modalidad && !await Profesor.findOne({ where: { modalidad } })) {
            return res.status(404).json({ mensaje: 'La modalidad no existe' });
        }

        if (materia && !await Materia.findOne({ where: { nombre: materia } })) {
            return res.status(404).json({ mensaje: 'La materia no existe' });
        }


        const profesores = await Profesor.findAll({
            // filtramos por modalidad y/o materia si se enviaron esos filtros, si no, devolvemos todos los profesores
            where: modalidad ? { modalidad } : {},
            attributes: { exclude: ['password'] },
            include: materia ? [{
                model: Materia,
                where: { nombre: materia },
            }] : []
        });

        // los filtros existen, pero no hay profesores que coincidan
        if ((modalidad || materia) && profesores.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontraron profesores para los filtros indicados'
            });
        }

        res.status(200).json(profesores);
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