const db = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        const [products] = await db.query(
            "SELECT COUNT(*) AS totalProducts FROM products"
        );

        const [orders] = await db.query(
            "SELECT COUNT(*) AS totalOrders FROM orders"
        );

        const [sales] = await db.query(
            `SELECT COALESCE(SUM(total_amount), 0) AS totalSales
             FROM orders
             WHERE status != 'Cancelled'`
        );

        const [customers] = await db.query(
            "SELECT COUNT(*) AS totalCustomers FROM customers"
        );

        res.status(200).json({
            totalProducts: products[0].totalProducts,
            totalOrders: orders[0].totalOrders,
            totalSales: sales[0].totalSales,
            totalCustomers: customers[0].totalCustomers
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};