
const ProfesorMateria = require('../models/profesorMateria.js');
const Profesor = require('../models/profesores.js');
const Materia = require('../models/materia.js');
const { Op } = require('sequelize');

// GET: obtener las materias de un profesor
// con paginacion, busqueda y ordenamiento
const obtenerMateriasDeProfesor = async (req, res) => {
    try {
        const id_profesor = Number(req.params.id);

        // validar el ID del profesor
        if (!Number.isInteger(id_profesor) || id_profesor <= 0) {
            return res.status(400).json({
                error: 'El ID del profesor debe ser un entero positivo'
            });
        }

        // verificar que el profesor exista
        const profesor = await Profesor.findByPk(id_profesor);

        if (!profesor) {
            return res.status(404).json({
                error: 'Profesor no encontrado'
            });
        }

        // obtener parametros de paginacion
        const pagina = Math.max(
            1,
            parseInt(req.query.pagina, 10) || 1
        );

        const limite = Math.min(
            100,
            Math.max(1, parseInt(req.query.limite, 10) || 10)
        );

        // obtener el texto de busqueda
        const buscar = req.query.buscar?.trim() || '';

        // definir campos permitidos para ordenar
        const camposOrden = [
            'id_materia',
            'nombre',
            'descripcion'
        ];

        const orden = camposOrden.includes(req.query.orden)
            ? req.query.orden
            : 'id_materia';

        // definir la direccion del ordenamiento
        const direccion = req.query.direccion?.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        // filtrar por nombre o descripcion
        const where = buscar
            ? {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${buscar}%` } },
                    { descripcion: { [Op.like]: `%${buscar}%` } }
                ]
            }
            : {};

        // obtener las materias asociadas al profesor
        const { count, rows } = await Materia.findAndCountAll({
            where,
            include: [{
                model: Profesor,
                where: { id_profesor },
                attributes: [],
                through: { attributes: [] },
                required: true
            }],
            distinct: true,
            limit: limite,
            offset: (pagina - 1) * limite,
            order: [[orden, direccion]]
        });

        return res.status(200).json({
            materias: rows,
            totalRegistros: count,
            pagina,
            limite,
            totalPaginas: Math.ceil(count / limite)
        });

    } catch (error) {
        console.error(
            'Error al obtener materias del profesor:',
            error
        );

        return res.status(500).json({
            error: 'Error interno al obtener materias del profesor'
        });
    }
};


// POST: asignar una materia a un profesor
const asignarMateriaAProfesor = async (req, res) => {
    try {
        const id_profesor = Number(req.params.id);
        const id_materia = Number(req.params.idMateria);

        // validar ambos IDs
        if (
            !Number.isInteger(id_profesor) || id_profesor <= 0 ||
            !Number.isInteger(id_materia) || id_materia <= 0
        ) {
            return res.status(400).json({
                error: 'Los IDs del profesor y de la materia deben ser enteros positivos'
            });
        }

        // verificar que el profesor exista
        const profesor = await Profesor.findByPk(id_profesor);

        if (!profesor) {
            return res.status(404).json({
                error: 'Profesor no encontrado'
            });
        }

        // verificar que la materia exista
        const materia = await Materia.findByPk(id_materia);

        if (!materia) {
            return res.status(404).json({
                error: 'Materia no encontrada'
            });
        }

        // verificar si la relacion ya existe
        const relacionExistente = await ProfesorMateria.findOne({
            where: { id_profesor, id_materia }
        });

        if (relacionExistente) {
            return res.status(409).json({
                error: 'El profesor ya está asignado a esta materia'
            });
        }

        // crear la relacion
        const profesorMateria = await ProfesorMateria.create({
            id_profesor,
            id_materia
        });

        return res.status(201).json({
            mensaje: 'Materia asignada al profesor correctamente',
            profesorMateria
        });

    } catch (error) {
        console.error('Error al asignar materia al profesor:', error);

        // controlar una posible duplicacion de la relacion
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'El profesor ya está asignado a esta materia'
            });
        }

        return res.status(500).json({
            error: 'Error interno al asignar materia al profesor'
        });
    }
};


// DELETE: eliminar la relacion entre un profesor y una materia
const eliminarMateriaDeProfesor = async (req, res) => {
    try {
        const id_profesor = Number(req.params.id);
        const id_materia = Number(req.params.idMateria);

        // validar ambos IDs
        if (
            !Number.isInteger(id_profesor) || id_profesor <= 0 ||
            !Number.isInteger(id_materia) || id_materia <= 0
        ) {
            return res.status(400).json({
                error: 'Los IDs del profesor y de la materia deben ser enteros positivos'
            });
        }

        // buscar la relacion existente
        const profesorMateria = await ProfesorMateria.findOne({
            where: { id_profesor, id_materia }
        });

        if (!profesorMateria) {
            return res.status(404).json({
                error: 'La relacion profesor-materia no existe'
            });
        }

        // eliminar solo la relacion, no la materia ni el profesor
        await profesorMateria.destroy();

        return res.status(200).json({
            mensaje: 'Materia eliminada del profesor correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar materia del profesor:', error);

        return res.status(500).json({
            error: 'Error interno al eliminar materia del profesor'
        });
    }
};


// Exportar las funciones del controlador
module.exports = {
    obtenerMateriasDeProfesor,
    asignarMateriaAProfesor,
    eliminarMateriaDeProfesor
};
