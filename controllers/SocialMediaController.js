const { SocialMedia, User } = require("../models");

class SocialMediaController {
  static async createSocialmedia(req, res) {
    try {
      const UserId = req.userData.id;
      const { name, social_media_url } = req.body;
      const data = {
        UserId,
        name,
        social_media_url,
      };

      const newSocmed = await SocialMedia.create(data);
      if (newSocmed) {
        res.status(201).json({
          social_media: {
            id: newSocmed.id,
            name: newSocmed.name,
            social_media_url: newSocmed.social_media_url,
            UserId: newSocmed.UserId,
            updatedAt: newSocmed.updatedAt,
            createdAt: newSocmed.createdAt,
          },
        });
      }
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  static getAllSocialmedias(req, res) {
    SocialMedia.findAll({ where: { UserId: req.userData.id }, include: User })
      .then((result) => {
        const socialMedias = result.map((socmed) => {
          return {
            id: socmed.id,
            name: socmed.name,
            social_media_url: socmed.social_media_url,
            UserId: socmed.UserId,
            createdAt: socmed.createdAt,
            updatedAt: socmed.updatedAt,
            User: {
              id: socmed.User.id,
              username: socmed.User.username,
              profile_image_url: socmed.User.profile_image_url,
            },
          };
        });
        if (socialMedias) {
          res.status(200).json({
            social_medias: socialMedias,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }

  static async updateSocialmediaById(req, res) {
    try {
      const { socialMediaId } = req.params;
      const { name, social_media_url } = req.body;
      const updatedUser = await SocialMedia.update(
        { name, social_media_url },
        {
          where: { id: socialMediaId, UserId: req.userData.id },
          returning: true,
        }
      );

      if (updatedUser[0] == 1) {
        res.status(200).json({
          social_media: {
            id: updatedUser[1][0].id,
            name: updatedUser[1][0].name,
            social_media_url: updatedUser[1][0].social_media_url,
            UserId: updatedUser[1][0].UserId,
            updatedAt: updatedUser[1][0].updatedAt,
            createdAt: updatedUser[1][0].createdAt,
          },
        });
      } else {
        throw {
          code: 404,
          message: "Social Media not found",
        };
      }
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(err.code || 500).json({ message: err.message });
      }
    }
  }

  static async deleteSocialmediaById(req, res) {
    try {
      const { socialMediaId } = req.params;
      const parsedSocialMediaId = parseInt(socialMediaId);

      if (isNaN(parsedSocialMediaId)) {
        throw {
          code: 400,
          message: "Invalid socialMediaId. It should be an integer.",
        };
      }
      const deletedSocmed = await SocialMedia.destroy({
        where: { id: parsedSocialMediaId, UserId: req.userData.id },
      });

      if (deletedSocmed) {
        res.status(200).json({
          message: "Your social media has been successfully deleted",
        });
      } else {
        throw {
          code: 404,
          message: "Social Media not found",
        };
      }
    } catch (err) {
      res.status(err.code || 500).json({ message: err.message });
    }
  }
}

module.exports = SocialMediaController;
