const categoryModel = require("../models/categoryModel");

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const result = await categoryModel.createCategory(
            name.trim(),
            description || null
        );

        res.status(201).json({
            message: "Category created successfully",
            categoryId: result.insertId
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create category"
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const result = await categoryModel.updateCategory(
            Number(id),
            name.trim(),
            description || null
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully"
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update category"
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await categoryModel.deleteCategory(Number(id));

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Cannot delete category because it has products"
            });
        }

        res.status(500).json({
            message: "Failed to delete category"
        });
    }
};

const reorderCategories = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({
                message: "Items must be an array"
            });
        }

        await categoryModel.reorderCategories(items);

        res.status(200).json({
            message: "Categories reordered successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to reorder categories"
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
};