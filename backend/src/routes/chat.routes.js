import { Router } from "express";
import { createChat } from "../controllers/chat.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-chat", authUser, createChat);
// router.get("/get-chat/:id", authUser, getChat);
// router.delete("/chat/:id", authUser, deleteChat);

export default router;
