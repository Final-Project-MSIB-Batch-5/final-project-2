const router = require("express").Router();
const SocialMediaController = require("../controllers/socialmediaController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/socialMedia_authorization");

router.use(authentication);
router.post("/", SocialMediaController.createSocialmedia);
router.get("/", SocialMediaController.getAllSocialmedias);
router.use("/:id", authorization);
router.put("/:id", SocialMediaController.updateSocialmediaById);
router.delete("/:id", SocialMediaController.deleteSocialmediaById);

module.exports = router;
