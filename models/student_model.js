const sequelize = require('sequelize')
const db = require('../database/conexion_mysql_db');

const Student = db.sequelize_connection.define('student', 
    {
        student_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize.STRING,
        },
        DNI: {
            type: sequelize.INTEGER,
            unique: true
        },
        birth_date: {
            type: sequelize.DATEONLY
        },
        status: {
            type: sequelize.STRING
        }

    }
);

module.exports = Student;