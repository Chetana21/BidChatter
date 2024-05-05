const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
} = require("../controllers/productControllers");

router.route("/").post(createProduct).get(protect, getAllProducts);

module.exports = router;
