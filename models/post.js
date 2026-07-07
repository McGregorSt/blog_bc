const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Twoja konfiguracja połączenia

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: false,
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
  textLead: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // ZMIANA: Teraz to tablica obiektów [ { paragraphLead, paragraphText }, ... ]
  textParagraphs: {
    type: DataTypes.JSONB, 
    allowNull: false,
    defaultValue: [],
    comment: 'Format: Array of objects [{ "paragraphLead": "string", "paragraphText": [["string"]] }]'
  },
  // Galeria jako tablica tablic z obiektami src
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