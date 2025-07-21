import express from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updateProfile,
} from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const UserRoute = express.Router();

UserRoute.post("/register", register);
UserRoute.post("/login", login);

UserRoute.get("/me", AuthMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

UserRoute.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

UserRoute.put("/profile", AuthMiddleware, updateProfile);
UserRoute.post("/forgot-password", forgotPassword);
UserRoute.post("/reset-password/:token", resetPassword);
export default UserRoute;
