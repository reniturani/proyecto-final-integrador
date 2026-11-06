
const express = require('express')
const router = express.Router()

const {
    solicitarRecuperacion,
    restablecerPassword
} = require('../controllers/passwordReset.controller')

// Solicitar recuperación
router.post('/forgot-password', solicitarRecuperacion)

// Restablecer contraseña
router.post('/reset-password', restablecerPassword)

module.exports = router
