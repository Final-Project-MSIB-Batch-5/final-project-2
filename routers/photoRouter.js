const router = require("express").Router();
const photoController = require("../controllers/PhotoController");

router.post("/", photoController.createPhoto);
router.get("/", photoController.getAllPhoto);
router.put("/:photoId", photoController.updatePhotoById);
router.delete("/:photoId", photoController.deletePhotoById);

module.exports = router;
