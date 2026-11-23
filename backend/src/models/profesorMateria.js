const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProfesorMateria = sequelize.define('ProfesorMateria', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },

    id_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
    
}, {
    tableName: 'profesor_materia',
    timestamps: false
});

module.exports = ProfesorMateria;