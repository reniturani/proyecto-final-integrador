const express = require('express');
const router = express.Router();
const { 
    obtenerProfesores, obtenerProfesorPorId, crearProfesor, actualizarProfesor, eliminarProfesor
} = require('../controllers/profesores.controller');

// importamos el middleware de autenticacion
const { verificarToken, verificarAdministrador } = require('../middlewares/auth.middleware');
// GET (ruta para ver todos) - publica
router.get('/', obtenerProfesores);

// GET (ruta para ver uno solo) - publica
router.get('/:id', obtenerProfesorPorId);

// POST (registro / creación) - PUBLICA (sirve tanto para que un profesor se registre como para que el administrador lo cree)
router.post('/', crearProfesor);

// PUT (actualizar general) - PROTEGIDA (Solo Administrador)
router.put('/:id', verificarToken, verificarAdministrador, actualizarProfesor);

// DELETE (eliminar) - PROTEGIDA (Solo Administrador)
router.delete('/:id', verificarToken, verificarAdministrador, eliminarProfesor);

module.exports = router;