const { Sequelize } = require('sequelize');

// Singleton Pattern for PostgreSQL Database Connection
const dbName = process.env.DB_NAME || 'ecommerce_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || '1234';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

let sequelize;

try {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} catch (err) {
  console.warn('PostgreSQL connection warning, falling back to SQLite:', err.message);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './ecommerce_dev.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
