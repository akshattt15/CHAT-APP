import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";

const router = express.Router();

// send message
router.post("/", protect, sendMessage);

// get all messages of a chat
router.get("/:chatId", protect, allMessages);

export default router;
