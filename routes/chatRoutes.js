import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats,
} from "../controllers/chatController.js";

const router = express.Router();

// create or access one-to-one chat
router.post("/", protect, accessChat);

// fetch all chats of logged-in user
router.get("/", protect, fetchChats);

export default router;
