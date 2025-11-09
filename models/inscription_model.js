const sequelize = require('sequelize');
const db = require('../database/conexion_mysql_db');

const Inscription = db.sequelize_connection.define('inscription', 
    {
        inscription_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        presence: {
            type: sequelize.INTEGER
        },
        subject_id: {
            type: sequelize.INTEGER
        },
        teacher_id: {
            type: sequelize.INTEGER
        },
        student_id: {
            type: sequelize.INTEGER
        },
        inscription_date: {
            type: sequelize.DATEONLY
        },
        status: {
            type: sequelize.STRING
        },
        rating_1: {
            type: sequelize.INTEGER
        },
        rating_2: {
            type: sequelize.INTEGER
        },
        final_rating: {
            type: sequelize.INTEGER
        }
    }
);

module.exports = Inscription;