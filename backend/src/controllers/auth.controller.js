const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Estudiante = require('../models/estudiantes');
const Profesor = require('../models/profesores');

const login = async (req, res) => {
    try {
        const { email, password, tipo } = req.body;

        if (!email || !password || !tipo) {
            return res.status(400).json({
                mensaje: 'Email, contraseña y tipo son obligatorios'
            });
        }

        // Login del administrador
        if (tipo === 'administrador') {
            const emailValido = email === process.env.ADMIN_EMAIL;
            const passwordValida = password === process.env.ADMIN_PASSWORD;

            if (!emailValido || !passwordValida) {
                return res.status(401).json({
                    mensaje: 'Credenciales incorrectas'
                });
            }

            const token = jwt.sign(
                { id: 'admin', tipo: 'administrador' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                mensaje: 'Login exitoso',
                token
            });
        }

        // Login de estudiantes y profesores
        let modelo;

        if (tipo === 'estudiante') {
            modelo = Estudiante;
        } else if (tipo === 'profesor') {
            modelo = Profesor;
        } else {
            return res.status(400).json({
                mensaje: 'Tipo de usuario inválido'
            });
        }

        const usuario = await modelo.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const id = tipo === 'estudiante'
            ? usuario.id_estudiante
            : usuario.id_profesor;

        const token = jwt.sign(
            { id, tipo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            mensaje: 'Login exitoso',
            token
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = { login };