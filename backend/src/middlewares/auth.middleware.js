import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies?.authUser;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access Denied!!" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await userModel
            .findById(decodedToken.id)
            .select("-password -__v  -createdAt -updatedAt");

        if (!currentUser) {
            return res.status(401).json({ message: "Unauthorized Access Denied!!" });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authUser;
