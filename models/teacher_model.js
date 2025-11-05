const sequelize = require('sequelize');
const db = require('../database/conexion_mysql_db');

const Teacher = db.sequelize_connection.define('teacher',
    {
        teacher_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize.STRING,
        },
        dni: {
            type: sequelize.INTEGER,
        },
        specialty: {
            type: sequelize.STRING
        }
    }
);

module.exports = Teacher;