const { Sequelize } = require('sequelize');

let sequelize;

// Automatically use isolated in-memory SQLite database during automated testing environments
if (process.env.NODE_ENV === 'test' || process.env.DB_TYPE === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  // Production / Development PostgreSQL Database Connection
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPass = process.env.DB_PASS || '1234';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;

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
}

module.exports = sequelize;
