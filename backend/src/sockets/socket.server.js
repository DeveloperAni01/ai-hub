import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        if (!cookies.authUser) {
            return next(new Error("Authentication error: No token found!!"));
        }

        try {
            const decodedToken = jwt.verify(cookies.authUser, process.env.JWT_SECRET);

            const currentUser = await userModel.findById(decodedToken.id);

            socket.user = currentUser;
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid token!!"));
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:->", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

export default initSocketServer;
