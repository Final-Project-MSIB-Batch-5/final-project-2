"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "UserId" });
      this.belongsTo(models.Photo, { foreignKey: "PhotoId" });
    }
  }
  Comment.init(
    {
      UserId: DataTypes.INTEGER,
      PhotoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Photo be required.",
          },
          notNull: {
            msg: "Photo be not null.",
          },
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Comment be required.",
          },
          notNull: {
            msg: "Comment be not null.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comment",
    }
  );
  return Comment;
};
