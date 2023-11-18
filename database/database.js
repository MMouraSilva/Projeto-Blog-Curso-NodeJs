const Sequelize = require("sequelize");

const connection = new Sequelize("GUIAPRESS", "sa", "123456", {
    host: "localhost",
    dialect: "mssql"
});

module.exports = connection;