const router = require("express").Router();
const commentController = require("../controllers/CommentController");

router.post("/", commentController.createComment);
router.get("/", commentController.getAllComments);
router.put("/:commentId", commentController.updateCommentById);
router.delete("/:commentId", commentController.deleteCommentById);

module.exports = router;
