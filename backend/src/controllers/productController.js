const productModel = require("../models/productModel");

const getProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();

        res.status(200).json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            categoryId,
            name,
            description,
            image,
            price,
            stock,
            isAvailable
        } = req.body;

        if (
            !categoryId ||
            !name ||
            name.trim() === "" ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "Category, name, price, and stock are required"
            });
        }

        if (Number(price) < 0 || Number(stock) < 0) {
            return res.status(400).json({
                message: "Price and stock cannot be negative"
            });
        }

        const result = await productModel.createProduct(
            Number(categoryId),
            name.trim(),
            description || null,
            Number(price),
            image || null,
            Number(stock),
            isAvailable !== undefined
                ? Boolean(isAvailable)
                : true
        );

        res.status(201).json({
            message: "Product created successfully",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product"
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            categoryId,
            name,
            description,
            image,
            price,
            stock,
            isAvailable
        } = req.body;

        if (
            !categoryId ||
            !name ||
            name.trim() === "" ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "Category, name, price, and stock are required"
            });
        }

        if (Number(price) < 0 || Number(stock) < 0) {
            return res.status(400).json({
                message: "Price and stock cannot be negative"
            });
        }

        const result = await productModel.updateProduct(
            Number(id),
            Number(categoryId),
            name.trim(),
            description || null,
            Number(price),
            image || null,
            Number(stock),
            isAvailable !== undefined
                ? Boolean(isAvailable)
                : true
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update product"
        });
    }
};

const uploadProductImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const result = await productModel.updateProductImage(
            Number(id),
            req.file.filename
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Image uploaded successfully",
            image: req.file.filename
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to upload image"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await productModel.deleteProduct(Number(id));

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    uploadProductImage,
    deleteProduct
};