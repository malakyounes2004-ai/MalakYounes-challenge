const db = require("../config/db");

const findCustomerByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM customers WHERE email = ?",
        [email]
    );

    return rows[0];
};

const createCustomer = async (name, email, phone, address) => {
    const [result] = await db.query(
        `INSERT INTO customers
        (name, email, phone, address)
        VALUES (?, ?, ?, ?)`,
        [name, email, phone, address]
    );

    return result;
};

module.exports = {
    findCustomerByEmail,
    createCustomer
};