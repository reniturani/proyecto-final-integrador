
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const PasswordReset = sequelize.define('PasswordReset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiracion: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'password_resets',
    timestamps: false
})

module.exports = PasswordReset
