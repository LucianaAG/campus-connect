const sequelize = require('sequelize');
const db = require('../database/conexion_mysql_db');


const Subject = db.sequelize_connection.define('subject',
    {
        subject_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize.STRING
        },
        code: {
            type: sequelize.STRING,
            unique: true
        },
        maximum_capacity: {
            type: sequelize.INTEGER
        },
        minimum_capacity: {
            type: sequelize.INTEGER
        },
        teacher_id: { 
            type: sequelize.INTEGER,
            allowNull: false
        }
    }
);

module.exports = Subject;