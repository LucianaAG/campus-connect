// importa 'mysql2' para ejecutar consultas sql
const mysql =  require('mysql2/promise');

// importa el ORM
const {Sequelize} = require('sequelize');

// definición y configuración de la BD
const sequelize_connection = new Sequelize('academy_db', 'root', '',
    {
        host : process.env.DB_HOST,
        dialect: 'mysql', // motor de BD que se va a útilizar
        port: process.env.DB_PORT || 3306,
        logging: false,
        define: {timestamps : false},
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// funcion que se asegura de que la BD exista antes de comenzar a útilizar el ORM
async function ensure_database() {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', password: ''});
    await connection.query(
        'CREATE DATABASE IF NOT EXISTS academy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
    );
    await connection.end();
}

// exporta la conexion al ORM y la funcion para asegurar la existencia de la BD
module.exports =  {sequelize_connection, ensure_database};