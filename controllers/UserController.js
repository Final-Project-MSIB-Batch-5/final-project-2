const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

class UserController {
  static async register(req, res) {
    try {
      const {
        email,
        username,
        full_name,
        password,
        profile_image_url,
        age,
        phone_number,
      } = req.body;

      // create data user
      const data = await User.create({
        email,
        username,
        full_name,
        password,
        profile_image_url,
        age,
        phone_number,
      });

      res.status(201).json({
        user: {
          email: data.email,
          full_name: data.full_name,
          username: data.username,
          profile_image_url: data.profile_image_url,
          age: data.age,
          phone_number: data.phone_number,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(error.code || 500).json({ message: error.message });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // find user in database
      const data = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "User not registered!",
        };
      }

      // verify password
      const verifyPassword = comparePassword(password, data.password);

      if (!verifyPassword) {
        throw {
          code: 401,
          message: "Incorrect password!",
        };
      }

      // generate token
      const token = generateToken({
        id: data.id,
        email: data.email,
        username: data.username,
      });

      res.status(200).json({
        token: token,
      });
    } catch (error) {
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async updateUserById(req, res) {
    try {
      const {
        email,
        full_name,
        username,
        profile_image_url,
        age,
        phone_number,
      } = req.body;

      const { userId } = req.params;

      const [arrowAffected, [updateDataUser]] = await User.update(
        {
          email,
          full_name,
          username,
          profile_image_url,
          age,
          phone_number,
        },
        {
          where: {
            id: {
              [Op.and]: [userId, req.userData.id],
            },
          },
          returning: true,
        }
      );

      if (arrowAffected === 0) {
        throw {
          code: 404,
          message: "User not found.",
        };
      }

      res.status(200).json({
        user: {
          email: updateDataUser.email,
          full_name: updateDataUser.full_name,
          username: updateDataUser.username,
          profile_image_url: updateDataUser.profile_image_url,
          age: updateDataUser.age,
          phone_number: updateDataUser.phone_number,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(error.code || 500).json({ message: error.message });
      }
    }
  }

  static async deleteUserById(req, res) {
    try {
      const { userId } = req.params;

      const data = await User.destroy({
        where: {
          id: {
            [Op.and]: [userId, req.userData.id],
          },
        },
      });
      if (!data) {
        throw {
          code: 404,
          message: "User not found.",
        };
      }
      res
        .status(200)
        .json({ message: "Your account has been successfully deleted" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
