const { where } = require("sequelize");
const { Comment, Photo, User } = require("../models");

class CommentController {
  // create comment
  static async createComment(req, res) {
    try {
      const { comment, PhotoId } = req.body;

      const data = await Comment.create({
        comment,
        PhotoId,
        UserId: req.userData.id,
      });

      res.status(201).json({
        comment: {
          id: data.id,
          comment: data.comment,
          UserId: data.UserId,
          PhotoId: data.PhotoId,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
        },
      });
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

  // get all comments
  static async getAllComments(req, res) {
    try {
      const data = await Comment.findAll({
        where: {
          UserId: req.userData.id,
        },
        include: [
          {
            model: Photo,
            attributes: ["id", "title", "caption", "poster_image_url"],
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url", "phone_number"],
          },
        ],
      });

      res.status(200).json({ comments: data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCommentById(req, res) {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;

      const [rowsAffected, [updatedDataComment]] = await Comment.update(
        {
          comment,
        },
        {
          where: {
            id: commentId,
            UserId: req.userData.id,
          },
          returning: true,
        }
      );

      if (rowsAffected === 0) {
        throw {
          code: 404,
          message: "Comment not found.",
        };
      }

      res.status(200).json({
        comment: {
          id: updatedDataComment.id,
          comment: updatedDataComment.comment,
          UserId: updatedDataComment.UserId,
          PhotoId: updatedDataComment.PhotoId,
          updatedAt: updatedDataComment.updatedAt,
          createdAt: updatedDataComment.createdAt,
        },
      });
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

  static async deleteCommentById(req, res) {
    try {
      const { commentId } = req.params;

      const data = await Comment.destroy({
        where: {
          id: commentId,
          UserId: req.userData.id,
        },
      });

      if (!data) {
        throw {
          code: 404,
          message: "Comment not found.",
        };
      }

      res
        .status(200)
        .json({ message: "Your comment has been successfully deleted" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

module.exports = CommentController;
