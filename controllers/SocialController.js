const { Socialmedia, User } = require("../models");

class SocialmediaController {
  static async createSocialmedia(req, res) {
    try {
      const UserId = res.locals.user.id;
      const { name, social_media_url } = req.body;
      let data = {
        UserId,
        name,
        social_media_url,
      };

      const newSocmed = await Socialmedia.create(data, { returning: true });
      if (newSocmed) {
        res.status(201).json({
          socialmedia: {
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
      console.log(err);
      return res.status(401).json(err);
    }
  }

  static getAllSocialmedias(req, res) {
    Socialmedia.findAll({ include: User })
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
          return res.status(200).json({
            social_medias: socialMedias,
          });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }

  static async updateSocialmediaById(req, res) {
    try {
      const socmedId = req.params.id;
      const { name, social_media_url } = req.body;
      const updatedUser = await Socialmedia.update(
        { name, social_media_url },
        { where: { id: socmedId }, returning: true }
      );

      if (updatedUser[0] == 1) {
        console.log(updatedUser);
        return res.status(200).json({
          social_medias: updatedUser[1],
        });
      } else {
        return res.status(400).json({ message: "Data not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json(err);
    }
  }

  static async deleteSocialmediaById(req, res) {
    try {
      const socmedId = req.params.id;
      const deletedSocmed = await Socialmedia.destroy({
        where: { id: socmedId },
      });

      if (deletedSocmed) {
        return res.status(200).json({
          message: "Your social media has been successfuly deleted",
        });
      } else {
        console.log(err);
        return res.status(401).json(err);
      }
    } catch (err) {
      console.log(err);
      return res.status(401).json(err);
    }
  }
}

module.exports = SocialmediaController;
