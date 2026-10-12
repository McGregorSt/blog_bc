const { DataTypes } = require('sequelize')
const sequelize = require('../util/database')
const Post = require('./post')

const PostTranslation = sequelize.define(
  'PostTranslation',
  {
    postId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: { model: Post, key: 'id' },
      onDelete: 'CASCADE',
    },
    language: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
      allowNull: false,
      validate: { isIn: [['EN', 'PL']] },
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    countryLabel: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    textLead: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    textParagraphs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    hero: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: 'post_translations',
    timestamps: false,
    underscored: true,
  },
)

Post.hasMany(PostTranslation, { as: 'translations', foreignKey: 'postId' })
PostTranslation.belongsTo(Post, { foreignKey: 'postId' })

module.exports = PostTranslation