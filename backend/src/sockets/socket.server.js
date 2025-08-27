import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import generateResponse from "../service/ai.service.js";
import messageModel from "../models/message.model.js";

const initSocketServer = (httpServer) => {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        if (!cookies.authUser) {
             next(new Error("Authentication error: No token found!!"));
        }

        try {
            const decodedToken = jwt.verify(cookies.authUser, process.env.JWT_SECRET);

            const currentUser = await userModel.findById(decodedToken.id).select("-password -__v -createdAt -updatedAt ").lean();

            socket.user = currentUser;
            next();
        } catch (error) {
             next(new Error("Authentication error: Invalid token!!"));
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:->", socket.user._id);

        socket.on("ai-message", async (messagePayload) => {
           
            await messageModel.create({
                user: socket.user._id,
                content: messagePayload.content,
                chatID: messagePayload.chatID,
                role: "user"
            });

            const chatHistory = await messageModel.find({ chatID: messagePayload.chatID })

            const response = await generateResponse(chatHistory.map(msg => {
                return {
                    role: msg.role,
                    parts:[{text: msg.content}]
                }
            }));

            await messageModel.create({
                user: socket.user._id,
                content: response,
                chatID: messagePayload.chatID,
                role: "model"
            });
            socket.emit("ai-response", { 
                content: response,
                chatID: messagePayload.chatID
             });
        })

        

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}; 

export default initSocketServer;
