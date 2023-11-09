const router = require("express").Router();
const userController = require("../controllers/UserController");
const { authentication } = require("../middlewares/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:userId", authentication, userController.updateUserById);
router.delete("/:userId", authentication, userController.deleteUserById);

module.exports = router;
