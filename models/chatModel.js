import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true }, // chat name or "sender" for 1-to-1
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users in chat
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // reference last message
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // only for group chat
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
