const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blog_app', 'postgres', 'root', {
  dialect: 'postgres',
  host: 'localhost',
  logging: false
});

module.exports = sequelize;