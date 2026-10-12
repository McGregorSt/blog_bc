const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Twoja konfiguracja połączenia

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  continent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tourStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tourEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  postGallery: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    comment: 'Format: [[{ "src": "string" }]]'
  },
  creator: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modifiedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true, 
  underscored: true 
});

module.exports = Post;