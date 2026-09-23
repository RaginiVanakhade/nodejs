const express = require("express");
const User = require("../modules/User");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Create user (Public Registration)
router.post("/user", async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // 👈 'role' पण घेत आहोत आता

       
        if (role === "admin") {
            return res.status(403).json({
                message: "Access denied. You cannot register as an admin."
            });
        }

        // Check email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "employee" 
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;