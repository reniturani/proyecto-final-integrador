const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
    id_estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false //obligatorio
    },

    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true //unico
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    foto_url: {
        type: DataTypes.STRING,
        allowNull: true // opcional
    }
}, {
    tableName: 'estudiantes', // Nombre de la tabla en la base de datos
    timestamps: false // Desactiva los campos de creación y actualización
});

module.exports = Estudiante;