const express = require('express');
const router = express.Router();

const {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
} = require('../controllers/estudiantes.controller');

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET: obtener todos los estudiantes (publico)
router.get('/', obtenerEstudiantes);

// GET: obtener un estudiante especifico por su ID (publico)
router.get('/:id', obtenerEstudiantePorId);

// POST: crear un estudiante (publico - registro)
router.post('/', crearEstudiante);

// PUT: actualizar un estudiante existente (protegido)
router.put('/:id', verificarToken, actualizarEstudiante);

// DELETE: eliminar un estudiante (protegido)
router.delete('/:id', verificarToken, eliminarEstudiante);

module.exports = router;