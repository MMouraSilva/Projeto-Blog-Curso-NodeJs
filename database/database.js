const Sequelize = require("sequelize");

const connection = new Sequelize("GUIAPRESS", "sa", "123456", {
    host: "localhost",
    dialect: "mssql",
    timezone: "-03:00"
});

module.exports = connection;