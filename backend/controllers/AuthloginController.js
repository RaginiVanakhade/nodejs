const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modules/User");

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // 1. Check email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 2. Check account status
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account is inactive"
            });
        }

        // 3. Compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // 5. Send response
        res.status(200).json({
            message: "Login successful",
            token,
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
};

module.exports = {
    login
};