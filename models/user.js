"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo, { foreignKey: "UserId" });
      this.hasMany(models.Comment, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Full name be required",
          },
          notNull: {
            msg: "Full name be not null",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid email address format!",
          },
          notEmpty: {
            args: true,
            msg: "Email be required",
          },
          notNull: {
            msg: "Email be not null",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username be required",
          },
          notNull: {
            msg: "Username be not null",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password be required",
          },
          notNull: {
            msg: "Password be not null",
          },
        },
      },
      profile_image_url: DataTypes.TEXT,
      age: DataTypes.NUMBER,
      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user) => {
          const hashedPassword = hashPassword(user.password);
          user.password = hashedPassword;
        },
      },
    }
  );
  return User;
};
