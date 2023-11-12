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
      this.hasMany(models.SocialMedia, { foreignKey: "UserId" });
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
            msg: "Full name be required.",
          },
          notNull: {
            msg: "Full name be not null.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Invalid email address format.",
          },
          notEmpty: {
            args: true,
            msg: "Email be required.",
          },
          notNull: {
            msg: "Email be not null.",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username be required.",
          },
          notNull: {
            msg: "Username be not null.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password be required.",
          },
          notNull: {
            msg: "Password be not null.",
          },
        },
      },
      profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Profile image url be required.",
          },
          notNull: {
            msg: "Profile image url be not null.",
          },
          isUrl: {
            msg: "Invalid profile image url format.",
          },
        },
      },
      age: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Age be required.",
          },
          notNull: {
            msg: "Age be not null.",
          },
          isInt: {
            msg: "Age be integer format.",
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Phone number be required.",
          },
          notNull: {
            msg: "Phone number not null.",
          },
          isInt: {
            msg: "Phone number be integer format.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
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
