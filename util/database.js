const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blog_bc', 'blog_user', 'Blazini8311', {
  dialect: 'postgres',
  host: 'localhost',
  logging: false
});

module.exports = sequelize;