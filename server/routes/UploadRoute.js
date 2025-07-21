import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "catering-system", // optional folder
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", AuthMiddleware, upload.single("image"), (req, res) => {
  res.status(200).json({ imageUrl: req.file.path });
});

export default router;
