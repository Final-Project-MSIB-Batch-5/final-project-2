const { Photo, Comment, User } = require("../models");

class PhotoController {
  // create photo
  static async createPhoto(req, res) {
    try {
      const { poster_image_url, title, caption } = req.body;

      const data = await Photo.create({
        poster_image_url,
        title,
        caption,
        UserId: req.userData.id,
      });

      res.status(201).json({
        id: data.id,
        poster_image_url: data.poster_image_url,
        title: data.title,
        caption: data.caption,
        UserId: data.UserId,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  // get all photo
  static async getAllPhoto(req, res) {
    try {
      const data = await Photo.findAll({
        include: [
          {
            model: Comment,
            attributes: ["comment"],
            include: {
              model: User,
              attributes: ["username"],
            },
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url"],
          },
        ],
      });

      res.status(200).json({ photos: data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updatePhotoById(req, res) {
    try {
      const { photoId } = req.params;
      const { title, caption, poster_image_url } = req.body;
      if (
        title === undefined &&
        caption === undefined &&
        poster_image_url === undefined
      ) {
        throw {
          code: 422,
          message: "Title, caption, and poster_image_url are required fields.",
        };
      }
      const [rowsAffected, [updatedDataPhoto]] = await Photo.update(
        {
          title,
          caption,
          poster_image_url,
        },
        {
          where: {
            id: photoId,
            UserId: req.userData.id,
          },
          returning: true,
        }
      );

      if (rowsAffected === 0) {
        throw {
          code: 404,
          message: "Photo not found.",
        };
      }

      res.status(200).json({ photo: updatedDataPhoto });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
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

  static async deletePhotoById(req, res) {
    try {
      const { photoId } = req.params;
      const data = await Photo.destroy({
        where: {
          id: photoId,
          UserId: req.userData.id,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "Photo not found.",
        };
      }

      res
        .status(200)
        .json({ message: "Your photo has been successfully deleted" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

module.exports = PhotoController;
