import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", protect, getUsers); // Protected route

export default router;
