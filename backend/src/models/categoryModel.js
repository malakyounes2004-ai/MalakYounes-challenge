const db = require("../config/db");

const getAllCategories = async () => {
    const [rows] = await db.query(
        `SELECT * FROM categories
         ORDER BY sort_order ASC, id DESC`
    );

    return rows;
};

const createCategory = async (name, description) => {
    const [result] = await db.query(
        `INSERT INTO categories
        (name, description)
        VALUES (?, ?)`,
        [name, description]
    );

    return result;
};

const updateCategory = async (id, name, description) => {
    const [result] = await db.query(
        `UPDATE categories
         SET name = ?, description = ?
         WHERE id = ?`,
        [name, description, id]
    );

    return result;
};

const deleteCategory = async (id) => {
    const [result] = await db.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    );

    return result;
};

const reorderCategories = async (items) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (const item of items) {
            await connection.query(
                `UPDATE categories
                 SET sort_order = ?
                 WHERE id = ?`,
                [item.sortOrder, item.id]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
};