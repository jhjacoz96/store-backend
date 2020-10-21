require('dotenv').config()

module.exports = {

    // Configuracion de la DB 
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || 8575345,
  database: process.env.DB_DATABASE || "postgres",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT || "postgres",

  //Configurar seeds
  seederStorage: "sequelize",
  seederStorageTableName: "seeds",

  // Configuracion de migracions
  migracionStorage: "sequelize",
  migracionStorageTableName: "migrations"
}
