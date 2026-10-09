const { Op } = require('sequelize');
const bycrypt = require('bcrypt');
const Estudiante  = require('../models/estudiantes.js');

//LISTADO, PAGINACION, BUSQUEDA Y CANTIDAD

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

