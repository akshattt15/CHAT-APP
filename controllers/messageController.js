// controllers/messageController.js

import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// ✅ Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    // Validation
    if (!content?.trim() || !chatId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Create message
    let message = await Message.create({
      sender: req.user._id, // from authMiddleware
      content: content.trim(),
      chat: chatId,
    });

    // Populate fields
    message = await message.populate("sender", "username email");
    message = await message.populate({
      path: "chat",
      populate: { path: "users", select: "username email" },
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    return res.status(201).json(message);
  } catch (err) {
    console.error("❌ Send message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all messages of a chat
export const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .populate({
        path: "chat",
        populate: { path: "users", select: "username email" },
      });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Fetch messages error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ (Optional) Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await message.deleteOne();
    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error("❌ Delete message error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
