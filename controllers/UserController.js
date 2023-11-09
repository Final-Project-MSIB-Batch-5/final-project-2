const { user } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
  static async register() {
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
      const data = await user.create({
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
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // find user in database
      const data = user.findOne({
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
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
