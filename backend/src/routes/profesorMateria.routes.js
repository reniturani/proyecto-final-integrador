const express = require('express');
const router = express.Router();
const { obtenerMateriasDeProfesor, asignarMateriaAProfesor, eliminarMateriaDeProfesor } = require('../controllers/profesorMateria.controller');

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET: obtener todas las materias de un profesor
router.get('/profesores/:id/materias', obtenerMateriasDeProfesor);

// POST: asignar una materia a un profesor (protegida)
router.post('/profesores/:id/materias/:idMateria', verificarToken, asignarMateriaAProfesor);

// DELETE: eliminar una materia de un profesor (protegida)
router.delete('/profesores/:id/materias/:idMateria', verificarToken, eliminarMateriaDeProfesor);

module.exports = router;