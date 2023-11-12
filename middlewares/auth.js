const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("token");
    // cek header token
    if (!token) {
      throw {
        code: 401,
        message: "Token not provided!",
      };
    }

    // verify token
    const decode = verifyToken(token);

    const userData = await User.findOne({
      where: {
        id: decode.id,
        email: decode.email,
        username: decode.username,
      },
    });

    if (!userData) {
      throw {
        code: 401,
        message: "User not found!",
      };
    }

    req.userData = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
    };

    next();
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

module.exports = { authentication };
