const express = require("express");
const router = express.Router();
const {
    obtenerMaterias,
    obtenerMateriaPorId,
    crearMateria,
    actualizarMateria,
    eliminarMateria
} = require("../controllers/materias.controller");

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET: obtener todas las materias
router.get('/', obtenerMaterias);

// GET: obtener una materia por ID
router.get('/:id', obtenerMateriaPorId);

// POST: crear una materia
router.post('/', crearMateria);

// PUT: actualizar una materia (protegida)
router.put('/:id', verificarToken, actualizarMateria);

// DELETE: eliminar una materia (protegida)
router.delete('/:id', verificarToken, eliminarMateria);

module.exports = router;