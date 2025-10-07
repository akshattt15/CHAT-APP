import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who sent
    content: { type: String, trim: true }, // message text
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // which chat
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
