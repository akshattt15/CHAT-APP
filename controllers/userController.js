import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    // Exclude current logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
