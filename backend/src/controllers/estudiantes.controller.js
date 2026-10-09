const { Op } = require('sequelize');
const bycrypt = require('bcrypt');
const Estudiante  = require('../models/estudiantes.js');

//GET obtener todos los estudiantes 
const obtenerEstudiantes = async (req, res) => {
    try {
        const pagina = Math.max(1, parseInt(req.query.pagina) || 1);
        const limite = Math.min(
            100,
            Math.max(1, parseInt(req.query.limite) || 10)
        );
        const buscar = req.query.buscar?.trim() || '';

        const camposOrden = [
            'id_estudiante',
            'nombre',
            'apellido',
            'email'
        ];

        const orden = camposOrden.includes(req.query.orden)
            ? req.query.orden
            : 'id_estudiante';

        const direccion = req.query.direccion?.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        const where = buscar
            ? {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${buscar}%` } },
                    { apellido: { [Op.like]: `%${buscar}%` } },
                    { email: { [Op.like]: `%${buscar}%` } }
                ]
            }
            : {};

        const { count, rows } = await Estudiante.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            limit: limite,
            offset: (pagina - 1) * limite,
            order: [[orden, direccion]]
        });

        res.status(200).json({
            datos: rows,
            totalRegistros: count,
            pagina,
            limite,
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        console.error('Error al listar estudiantes:', error);
        res.status(500).json({
            mensaje: 'Error interno al listar estudiantes'
        });
    }
};

// GET obtener estudiante por su ID
const obtenerEstudiantePorId = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(
            req.params.id,
            { attributes: { exclude: ['password'] } }
        );

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'Estudiante no encontrado'
            });
        }

        res.status(200).json(estudiante);
    } catch (error) {
        console.error('Error al buscar estudiante:', error);
        res.status(500).json({
            mensaje: 'Error interno al buscar estudiante'
        });
    }
};

// POST crear un nuevo estudiante
const crearEstudiante = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            foto_url
        } = req.body;

        if (!nombre?.trim() || !apellido?.trim() ||
            !email?.trim() || !password) {
            return res.status(400).json({
                mensaje: 'Nombre, apellido, email y contraseña son obligatorios'
            });
        }

        const emailExistente = await Estudiante.findOne({
            where: { email: email.trim() }
        });

        if (emailExistente) {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const estudiante = await Estudiante.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim(),
            password: passwordHash,
            foto_url
        });

        const respuesta = estudiante.toJSON();
        delete respuesta.password;

        res.status(201).json({
            mensaje: 'Estudiante creado correctamente',
            datos: respuesta
        });
    } catch (error) {
        console.error('Error al crear estudiante:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'Error interno al crear estudiante'
        });
    }
};

// PUT actualizar un estudiante existente
const actualizarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'Estudiante no encontrado'
            });
        }

        const { nombre, apellido, email, password, foto_url } = req.body;
        const cambios = {};

        if (nombre !== undefined) cambios.nombre = nombre.trim();
        if (apellido !== undefined) cambios.apellido = apellido.trim();
        if (email !== undefined) cambios.email = email.trim();
        if (foto_url !== undefined) cambios.foto_url = foto_url;

        if (password) {
            cambios.password = await bcrypt.hash(password, 10);
        }

        if (
            (cambios.nombre !== undefined && !cambios.nombre) ||
            (cambios.apellido !== undefined && !cambios.apellido) ||
            (cambios.email !== undefined && !cambios.email)
        ) {
            return res.status(400).json({
                mensaje: 'Nombre, apellido y email no pueden estar vacíos'
            });
        }

        if (cambios.email) {
            const emailExistente = await Estudiante.findOne({
                where: {
                    email: cambios.email,
                    id_estudiante: { [Op.ne]: estudiante.id_estudiante }
                }
            });

            if (emailExistente) {
                return res.status(409).json({
                    mensaje: 'El email ya está registrado'
                });
            }
        }

        await estudiante.update(cambios);

        const respuesta = estudiante.toJSON();
        delete respuesta.password;

        res.status(200).json({
            mensaje: 'Estudiante actualizado correctamente',
            datos: respuesta
        });
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'Error interno al actualizar estudiante'
        });
    }
};

// DELETE eliminar un estudiante existente
const eliminarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);

        if (!estudiante) {
            return res.status(404).json({
                mensaje: 'Estudiante no encontrado'
            });
        }

        await estudiante.destroy();

        res.status(200).json({
            mensaje: 'Estudiante eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({
            mensaje: 'Error interno al eliminar estudiante'
        });
    }
};

module.exports = {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
};