const db = require("../config/db");

const createOrder = async (
    customerId,
    items
) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        let totalAmount = 0;
        const productData = [];

        for (const item of items) {
            const [rows] = await connection.query(
                `SELECT id, name, price, stock, is_available
                 FROM products
                 WHERE id = ?
                 FOR UPDATE`,
                [item.productId]
            );

            if (rows.length === 0) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const product = rows[0];

            if (!product.is_available) {
                throw new Error(`${product.name} is not available`);
            }

            if (item.quantity <= 0) {
                throw new Error("Invalid quantity");
            }

            if (item.quantity > product.stock) {
                throw new Error(
                    `Not enough stock for ${product.name}`
                );
            }

            totalAmount +=
                Number(product.price) * Number(item.quantity);

            productData.push({
                ...product,
                quantity: Number(item.quantity)
            });
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders
            (customer_id, total_amount, status)
            VALUES (?, ?, ?)`,
            [customerId, totalAmount, "Pending"]
        );

        const orderId = orderResult.insertId;

        for (const product of productData) {
            await connection.query(
                `INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    product.id,
                    product.quantity,
                    product.price
                ]
            );

            await connection.query(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [product.quantity, product.id]
            );
        }

        await connection.commit();

        return {
            orderId,
            totalAmount
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getAllOrders = async () => {
    const [rows] = await db.query(`
        SELECT
            orders.id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            customers.name AS customer_name,
            customers.email,
            customers.phone,
            customers.address
        FROM orders
        INNER JOIN customers
            ON orders.customer_id = customers.id
        ORDER BY orders.created_at DESC
    `);

    return rows;
};

const getOrderById = async (id) => {
    const [orders] = await db.query(
        `
        SELECT
            orders.id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            customers.name AS customer_name,
            customers.email,
            customers.phone,
            customers.address
        FROM orders
        INNER JOIN customers
            ON orders.customer_id = customers.id
        WHERE orders.id = ?
        `,
        [id]
    );

    if (orders.length === 0) {
        return null;
    }

    const [items] = await db.query(
        `
        SELECT
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name
        FROM order_items
        INNER JOIN products
            ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
        `,
        [id]
    );

    return {
        ...orders[0],
        items
    };
};

const updateOrderStatus = async (id, status) => {
    const [result] = await db.query(
        `UPDATE orders
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );

    return result;
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};