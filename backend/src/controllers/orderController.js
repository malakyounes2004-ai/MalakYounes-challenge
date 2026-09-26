const orderModel = require("../models/orderModel");
const customerModel = require("../models/customerModel");

const createOrder = async (req, res) => {
    try {
        const {
            customer,
            items
        } = req.body;

        if (
            !customer ||
            !customer.name ||
            !customer.email ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                message: "Customer details and cart items are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(customer.email)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        let existingCustomer =
            await customerModel.findCustomerByEmail(
                customer.email
            );

        let customerId;

        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const result =
                await customerModel.createCustomer(
                    customer.name.trim(),
                    customer.email.trim(),
                    customer.phone || null,
                    customer.address || null
                );

            customerId = result.insertId;
        }

        const order = await orderModel.createOrder(
            customerId,
            items
        );

        res.status(201).json({
            message: "Order placed successfully",
            orderId: order.orderId,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message || "Failed to create order"
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await orderModel.getOrderById(
            Number(req.params.id)
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch order"
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const result =
            await orderModel.updateOrderStatus(
                Number(req.params.id),
                status
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update order status"
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus
};