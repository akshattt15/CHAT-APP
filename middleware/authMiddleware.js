import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1]; // get token after 'Bearer '

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    res.status(401).json({ message: "Not authorized" });
  }
};
