const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/stats",
    protect,
    dashboardController.getDashboardStats
);

module.exports = router;