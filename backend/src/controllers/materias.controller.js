const Materia = require("../models/materia.js");
const { Op } = require("sequelize");

// GET: obtener todas las materias (con paginacion, busqueda por nombre o descripcion, y ordenamiento)
const obtenerMaterias = async (req, res) => {
    try {
        // obtenemos la página y la cantidad de resultados
        const pagina = Math.max(1, parseInt(req.query.pagina) || 1);
        const limite = Math.min(
            100,
            Math.max(1, parseInt(req.query.limite) || 10)
        );

        // obtenemos el texto que se quiere buscar
        const buscar = req.query.buscar?.trim() || '';

        // definimos los campos permitidos para ordenar
        const camposOrden = [
            'id_materia',
            'nombre',
            'descripcion'
        ];

        const orden = camposOrden.includes(req.query.orden)
            ? req.query.orden
            : 'id_materia';

        // definimos la dirección del orden
        const direccion = req.query.direccion?.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        // buscamos por nombre o descripción
        const where = buscar
            ? {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${buscar}%` } },
                    { descripcion: { [Op.like]: `%${buscar}%` } }
                ]
            }
            : {};

        // obtenemos las materias y la cantidad total
        const { count, rows } = await Materia.findAndCountAll({
            where,
            limit: limite,
            offset: (pagina - 1) * limite,
            order: [[orden, direccion]]
        });

        // respondemos con los datos y la información de paginación
        res.status(200).json({
            datos: rows,
            totalRegistros: count,
            pagina,
            limite,
            totalPaginas: Math.ceil(count / limite)
        });

    } catch (error) {
        console.error("Error al obtener materias:", error);

        res.status(500).json({
            mensaje: "Error interno al cargar la lista de materias"
        });
    }
};


// GET: obtener una materia especifica por su ID
const obtenerMateriaPorId = async (req, res) => {
    try {
    const { id } = req.params;
    const materia = await Materia.findByPk(id);

    if (!materia) {
        return res.status(404).json({ mensaje: "Materia no encontrada" });
    }
    res.status(200).json(materia);
    } catch (error) {
    console.error("Error al obtener la materia:", error);
    res.status(500).json({ mensaje: "Error interno al cargar la materia" });
    }
};

// POST: crear una nueva materia
const crearMateria = async (req, res) => {
    try {
    const { nombre, descripcion } = req.body;

    // Validamos que el nombre sea un string no vacío
    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({
        mensaje: "El nombre es un campo obligatorio y debe ser un texto válido",
        });
    }

    // Validamos que la descripción sea un texto si se envía, ya que es opcional y puede ser null
    if (descripcion !== undefined && descripcion !== null && typeof descripcion !== "string") {
        return res.status(400).json({
        mensaje: "La descripción debe ser un texto",
        });
    }

    const nuevaMateria = await Materia.create({
        nombre: nombre.trim(), 
        descripcion : descripcion?.trim() || null});

    res.status(201)
    .json({ mensaje: "Materia creada correctamente", materia: nuevaMateria });
    } catch (error) {
    console.error("Error al crear la materia:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409)
        .json({ mensaje: "Ya existe una materia con ese nombre" });
    }

    res.status(500).json({ mensaje: "Error interno al crear la materia" });
    }
};

// PUT: actualizar una materia existente
const actualizarMateria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        // validamos el nombre si se envía
        if (nombre !== undefined &&
            (typeof nombre !== "string" || !nombre.trim())) {
            return res.status(400).json({
                mensaje: "El nombre debe ser un texto válido"
            });
        }

        // validamos la descripción si se envía
        if (descripcion !== undefined &&
            descripcion !== null &&
            typeof descripcion !== "string") {
            return res.status(400).json({
                mensaje: "La descripción debe ser un texto"
            });
        }

        // buscamos la materia por su ID
        const materia = await Materia.findByPk(id);

        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            });
        }

        // armamos un objeto solo con los campos enviados
        const cambios = {};

        if (nombre !== undefined) {
            cambios.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            cambios.descripcion = descripcion?.trim() || null;
        }

        // validamos que se haya enviado al menos un campo para actualizar
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({
                mensaje: "Debe enviar al menos un campo para actualizar"
        });
}
        // aplicamos los cambios
        await materia.update(cambios);

        res.status(200).json({
            mensaje: "Materia actualizada correctamente",
            datos: materia
        });

    } catch (error) {
        console.error("Error al actualizar la materia:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                mensaje: "Ya existe una materia con ese nombre"
            });
        }

        res.status(500).json({
            mensaje: "Error interno al actualizar la materia"
        });
    }
};


// DELETE: eliminar una materia existente
const eliminarMateria = async (req, res) => {
    try {
    const { id } = req.params;
    const materia = await Materia.findByPk(id);

    if (!materia) {
        return res.status(404).json({ mensaje: "Materia no encontrada" });
    }

    await materia.destroy();
    res.status(200).json({ mensaje: "Materia eliminada correctamente" });
    } catch (error) {
    console.error("Error al eliminar la materia:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar la materia" });
    }
};

// Exportar las funciones del controlador
module.exports = {
    obtenerMaterias,
    obtenerMateriaPorId,
    crearMateria,
    actualizarMateria,
    eliminarMateria,
};