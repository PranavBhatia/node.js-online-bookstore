const Sequelize = require("sequelize");

const sequelize = new Sequelize("node.js-online-shop", "root", "123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
