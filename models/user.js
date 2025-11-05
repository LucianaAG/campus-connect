const sequelize = require('sequelize');
const db = require('../database/conexion_mysql_db');
const bcrypt = require('bcryptjs');


const user = db.sequelize_connection.define('users',
    {
        user_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize.STRING(100),
            allowNull: false
        },
        email: {
            type: sequelize.STRING(100)
        },
        password: {
            type: sequelize.STRING(100)
        },
    },
    {
        hooks: 
            {
                async beforeCreate(user)
                {
                    const salt = await bcrypt.genSalt(10);
                    const hash =  await bcrypt.hash(user.password, salt);
                    user.password = hash;
                }
            }
    }
);

module.exports = user;