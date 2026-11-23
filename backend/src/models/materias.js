const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Materia = sequelize.define('Materia', {
    id_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    
}, {
    tableName: 'materia',
    timestamps: false 
});

module.exports = Materia;