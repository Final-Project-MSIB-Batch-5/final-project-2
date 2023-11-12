"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "UserId" });
      this.hasMany(models.Comment, { foreignKey: "PhotoId" });
    }
  }
  Photo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title be required.",
          },
          notNull: {
            msg: "Title be not null.",
          },
        },
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Caption be required.",
          },
          notNull: {
            msg: "Caption be not null.",
          },
        },
      },
      poster_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Poster image url be required.",
          },
          notNull: {
            msg: "Poster image url be not null.",
          },
          isUrl: {
            msg: "Invalid poster image url format.",
          },
        },
      },
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Photo",
      tableName: "Photo",
    }
  );
  return Photo;
};
