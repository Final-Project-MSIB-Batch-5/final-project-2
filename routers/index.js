const router = require("express").Router();
const userRouter = require("./userRouter");
const photoRouter = require("./photoRouter");
const commentRouter = require("./commentRouter");
const socialmediaRouter = require("./socialmediaRouter");
const { authentication } = require("../middlewares/auth");

router.use("/users", userRouter);
router.use("/photos", authentication, photoRouter);
router.use("/comments", authentication, commentRouter);
router.use("/socialmedias", authentication, socialmediaRouter);

module.exports = router;
