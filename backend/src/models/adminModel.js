const db = require("../config/db");

const findAdminByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM admins WHERE email = ?",
        [email]
    );

    return rows[0];
};

const createAdmin = async (name, email, password) => {
    const [result] = await db.query(
        `INSERT INTO admins
        (name, email, password)
        VALUES (?, ?, ?)`,
        [name, email, password]
    );

    return result;
};

module.exports = {
    findAdminByEmail,
    createAdmin
};