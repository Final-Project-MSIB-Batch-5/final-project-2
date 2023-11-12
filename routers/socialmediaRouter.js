const router = require("express").Router();
const socialMediaController = require("../controllers/SocialMediaController");

router.post("/", socialMediaController.createSocialmedia);
router.get("/", socialMediaController.getAllSocialmedias);
router.put("/:socialMediaId", socialMediaController.updateSocialmediaById);
router.delete("/:socialMediaId", socialMediaController.deleteSocialmediaById);

module.exports = router;
