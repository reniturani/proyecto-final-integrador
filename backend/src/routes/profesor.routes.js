const express = require('express');
const router = express.Router();
const { 
    obtenerProfesores, obtenerProfesorPorId, crearProfesor, actualizarProfesor, eliminarProfesor
} = require('../controllers/profesores.controller');

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET (ruta para ver todos) - publica
router.get('/', obtenerProfesores);

// GET (ruta para ver uno solo) - publica
router.get('/:id', obtenerProfesorPorId);

// POST (registro) - publica
router.post('/', crearProfesor);

// PUT (actualizar) - protegida
router.put('/:id', verificarToken, actualizarProfesor);

// DELETE (eliminar) - protegida
router.delete('/:id', verificarToken, eliminarProfesor);

module.exports = router;