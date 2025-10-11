import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

// ✅ Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://chatttyyyy.netlify.app","https://newchatty.netlify.app/"],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://chatttyyyy.netlify.app","https://newchatty.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies/auth headers if needed
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Store online users (userId → socketId)
const onlineUsers = new Map();

// ✅ Socket.io Events
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // 🟢 When a user comes online
  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys())); // broadcast
    console.log("🟢 Online users:", Array.from(onlineUsers.keys()));
  });

  // 💬 Join specific chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // 📩 Handle sending messages
  socket.on("sendMessage", (messageData) => {
    io.to(messageData.chatId).emit("receiveMessage", messageData);
  });

  // 🔴 Handle disconnect
  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys())); // update all clients
    console.log("❌ User disconnected:", socket.id);
  });
});

// MongoDB + Server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(process.env.PORT || 5000, () =>
      console.log("🚀 Server running with Socket.io...")
    );
  })
  .catch((err) => console.error(err));
