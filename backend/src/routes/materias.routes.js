const express = require("express");
const router = express.Router();

const {
    obtenerMaterias,
    obtenerMateriaPorId,
    crearMateria,
    actualizarMateria,
    eliminarMateria
} = require("../controllers/materias.controller");

const {
    verificarToken,
    verificarAdministrador
} = require('../middlewares/auth.middleware');

// GET: obtener todas las materias
router.get('/', obtenerMaterias);

// GET: obtener una materia por ID
router.get('/:id', obtenerMateriaPorId);

// POST: crear una materia (solo administrador)
router.post('/', verificarToken, verificarAdministrador, crearMateria);

// PUT: actualizar una materia (solo administrador)
router.put('/:id', verificarToken, verificarAdministrador, actualizarMateria);

// DELETE: eliminar una materia (solo administrador)
router.delete('/:id', verificarToken, verificarAdministrador, eliminarMateria);

module.exports = router;