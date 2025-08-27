import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName?.firstName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName,
            },
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user" });
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res
            .cookie("authUser", token, {
                secure: true,
                httpOnly: true,
                sameSite: "Strict",
            })
            .status(201)
            .json({
                message: "User registered successfully",
            });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    
        res.cookie("authUser", token, {
            secure: true,
            httpOnly: true,
            sameSite: "Strict",
        })
        .status(200)
        .json({
            message: "User logged in successfully",
            user: {
                email: user.email,
                fullName: user.fullName,
            },
        });
};

const userProfile = async (req, res) => {
    const currentUser = req.user
    res.status(200).json({ user: currentUser });
}

const logoutUser = (req, res) => {
    res
        .clearCookie("authUser")
        .status(200)
        .json({ message: "User logged out successfully" });
};

export { registerUser, loginUser, userProfile, logoutUser };
