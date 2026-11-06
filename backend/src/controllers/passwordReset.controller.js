
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const { Estudiante, Profesor, PasswordReset } = require('../models')

// Solicitar recuperación de contraseña
const solicitarRecuperacion = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                mensaje: 'El email es obligatorio'
            })
        }

        // Buscar primero al estudiante y después al profesor
        let usuario = await Estudiante.findOne({ where: { email } })
        let tipoUsuario = 'estudiante'

        if (!usuario) {
            usuario = await Profesor.findOne({ where: { email } })
            tipoUsuario = 'profesor'
        }

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'No existe un usuario registrado con ese email'
            })
        }

        // Eliminar solicitudes anteriores del mismo usuario
        const usuarioId = tipoUsuario === 'estudiante'
            ? usuario.id_estudiante
            : usuario.id_profesor

        await PasswordReset.destroy({
            where: {
                usuario_id: usuarioId,
                tipo_usuario: tipoUsuario
            }
        })

        // Generar token seguro
        const token = crypto.randomBytes(32).toString('hex')
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        // El token vence en 15 minutos
        const expiracion = new Date(Date.now() + 15 * 60 * 1000)

        await PasswordReset.create({
            usuario_id: usuarioId,
            tipo_usuario: tipoUsuario,
            token_hash: tokenHash,
            expiracion
        })

        // Token visible solamente durante el desarrollo
        return res.status(200).json({
            mensaje: 'Solicitud de recuperación generada correctamente',
            token: process.env.NODE_ENV === 'production' ? undefined : token
        })

    } catch (error) {
        console.error('Error al solicitar recuperación:', error)

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        })
    }
}

// Restablecer contraseña
const restablecerPassword = async (req, res) => {
    try {
        const { token, nuevaPassword } = req.body

        if (!token || !nuevaPassword) {
            return res.status(400).json({
                mensaje: 'El token y la nueva contraseña son obligatorios'
            })
        }

        if (nuevaPassword.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            })
        }

        // Calcular el hash del token recibido
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const solicitud = await PasswordReset.findOne({
            where: { token_hash: tokenHash }
        })

        if (!solicitud) {
            return res.status(400).json({
                mensaje: 'El token no es válido'
            })
        }

        if (new Date(solicitud.expiracion) < new Date()) {
            await solicitud.destroy()

            return res.status(400).json({
                mensaje: 'El token ha expirado. Solicitá uno nuevo'
            })
        }

        // Identificar el modelo correspondiente
        const modelo = solicitud.tipo_usuario === 'estudiante'
            ? Estudiante
            : solicitud.tipo_usuario === 'profesor'
                ? Profesor
                : null

        if (!modelo) {
            return res.status(400).json({
                mensaje: 'Tipo de usuario inválido'
            })
        }

        const campoId = solicitud.tipo_usuario === 'estudiante'
            ? 'id_estudiante'
            : 'id_profesor'

        const usuario = await modelo.findByPk(solicitud.usuario_id)

        if (!usuario) {
            await solicitud.destroy()

            return res.status(404).json({
                mensaje: 'No se encontró el usuario'
            })
        }

        // Encriptar la nueva contraseña
        const passwordHash = await bcrypt.hash(nuevaPassword, 10)

        usuario.password = passwordHash
        await usuario.save()

        // El token se elimina para impedir que vuelva a utilizarse
        await solicitud.destroy()

        return res.status(200).json({
            mensaje: 'Contraseña actualizada correctamente'
        })

    } catch (error) {
        console.error('Error al restablecer contraseña:', error)

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        })
    }
}

module.exports = {
    solicitarRecuperacion,
    restablecerPassword
}
