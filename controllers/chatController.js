import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// create or access 1-to-1 chat
export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send("UserId missing");

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (isChat.length > 0) return res.send(isChat[0]);

  // if chat doesn't exist, create it
  const chatData = { chatName: "sender", isGroupChat: false, users: [req.user._id, userId] };
  const createdChat = await Chat.create(chatData);
  const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
  res.status(200).send(fullChat);
};

// fetch all chats of logged-in user
export const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });
  res.send(chats);
};
