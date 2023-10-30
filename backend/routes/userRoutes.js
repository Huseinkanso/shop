import express from "express";
const router = express.Router();
import {
  getUsers,
  logout,
  registerUser,
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect,admin,getUsers).post(registerUser);

router.post("/logout", protect, logout);

router.post("/auth", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/:id").delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser);

export default router;
