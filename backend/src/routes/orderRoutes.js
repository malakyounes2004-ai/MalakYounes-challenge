const express = require("express");
const orderController = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", orderController.createOrder);

router.get("/", protect, orderController.getOrders);
router.get("/:id", protect, orderController.getOrder);
router.put("/:id/status", protect, orderController.updateOrderStatus);

module.exports = router;