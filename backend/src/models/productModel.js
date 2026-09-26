const db = require("../config/db");

const getAllProducts = async () => {
    const [rows] = await db.query(`
        SELECT 
            products.id,
            products.name,
            products.description,
            products.price,
            products.image,
            products.stock,
            products.is_available,
            products.category_id,
            products.sort_order,
            categories.name AS category_name
        FROM products
        INNER JOIN categories 
            ON products.category_id = categories.id
        ORDER BY products.sort_order ASC, products.id DESC
    `);

    return rows;
};

const createProduct = async (
    categoryId,
    name,
    description,
    price,
    image,
    stock,
    isAvailable
) => {
    const [result] = await db.query(
        `INSERT INTO products
        (category_id, name, description, price, image, stock, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            categoryId,
            name,
            description,
            price,
            image,
            stock,
            isAvailable
        ]
    );

    return result;
};

const updateProduct = async (
    id,
    categoryId,
    name,
    description,
    price,
    image,
    stock,
    isAvailable
) => {
    const [result] = await db.query(
        `UPDATE products
        SET category_id = ?,
            name = ?,
            description = ?,
            price = ?,
            image = ?,
            stock = ?,
            is_available = ?
        WHERE id = ?`,
        [
            categoryId,
            name,
            description,
            price,
            image,
            stock,
            isAvailable,
            id
        ]
    );

    return result;
};

const updateProductImage = async (id, image) => {
    const [result] = await db.query(
        `UPDATE products
         SET image = ?
         WHERE id = ?`,
        [image, id]
    );

    return result;
};

const deleteProduct = async (id) => {
    const [result] = await db.query(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    updateProductImage,
    deleteProduct
};