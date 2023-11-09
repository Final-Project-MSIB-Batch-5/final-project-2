const { Socialmedia } = require("../models");

const authorization = (req, res, next) => {
  const id = req.params.id;
  const authenticatedUser = res.locals.user;
  const url = req.baseUrl;

  Socialmedia.findOne({ where: { id } })
    .then((socmed) => {
      if (!socmed) {
        return res.status(404).json({
          name: "Data not found",
          devMessage: `Social media with id ${id} not found`,
        });
      }

      if (socmed.UserId === authenticatedUser.id) {
        return next();
      } else {
        return res.status(403).json({
          name: "Authorization Error",
          devMessage: `User with id "${authenticatedUser.id}" does not have permission to access Social Media with id "${id}"`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

module.exports = authorization;
