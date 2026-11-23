const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    foto_url: {
        type: DataTypes.STRING,
        allowNull: true
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    precio_hora: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    modalidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, {
    tableName: 'profesores',
    timestamps: false
});

module.exports = Profesor;