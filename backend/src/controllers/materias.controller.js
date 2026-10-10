const Materia = require("../models/materia.js");

// GET: obtener todas las materias
const obtenerMaterias = async (req, res) => {
    try {
    const materias = await Materia.findAll();
    res.status(200).json(materias);
    } catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ mensaje: "Error interno al cargar la lista de materias" });
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

    const nuevaMateria = await Materia.create({ nombre, descripcion });

    res.status(201)
    .json({ mensaje: "Materia creada correctamente", materia: nuevaMateria });
    } catch (error) {
    console.error("Error al crear la materia:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400)
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

    // Validamos el nombre si se envía, ya que se puede mantener el actual
    if (nombre !== undefined && (typeof nombre !== "string" || !nombre.trim())) {
        return res.status(400).json({
        mensaje: "El nombre debe ser un texto válido",
        });
    }

    // La descripción es opcional y puede ser null, pero si se envía debe ser un texto
    if (descripcion !== undefined && descripcion !== null && typeof descripcion !== "string") {
        return res.status(400).json({
        mensaje: "La descripción debe ser un texto",
        });
    }

    const materia = await Materia.findByPk(id);

    if (!materia) {
        return res.status(404).json({ mensaje: "Materia no encontrada" });
    }

    // Conservamos los campos que no se envían. En descripción, null se permite para poder dejarla vacía.
    await materia.update({
        nombre: nombre || materia.nombre,
        descripcion: descripcion !== undefined ? descripcion : materia.descripcion,
    });
    res.status(200)
    .json({ mensaje: "Materia actualizada correctamente", materia: materia });
    } catch (error) {
    console.error("Error al actualizar la materia:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400)
        .json({ mensaje: "Ya existe una materia con ese nombre" });
    }

    res.status(500).json({ mensaje: "Error interno al actualizar la materia" });
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