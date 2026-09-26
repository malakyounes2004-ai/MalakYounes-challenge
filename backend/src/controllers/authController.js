const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminModel = require("../models/adminModel");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin =
            await adminModel.findAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingAdmin =
            await adminModel.findAdminByEmail(email);

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result =
            await adminModel.createAdmin(
                name.trim(),
                email.trim(),
                hashedPassword
            );

        res.status(201).json({
            message: "Admin created successfully",
            adminId: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create admin"
        });
    }
};

module.exports = {
    login,
    createAdmin
};