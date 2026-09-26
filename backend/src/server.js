require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");

        res.json({
            message: "Web Development Challenge API is running!",
            database: "Connected successfully",
            test: rows[0].test
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});