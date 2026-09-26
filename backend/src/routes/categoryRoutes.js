const express = require("express");
const categoryController = require("../controllers/categoryController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.post("/", protect, categoryController.createCategory);

router.put("/reorder/list", protect, categoryController.reorderCategories);

router.put("/:id", protect, categoryController.updateCategory);
router.delete("/:id", protect, categoryController.deleteCategory);

module.exports = router;