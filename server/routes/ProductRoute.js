import express from "express";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  hideProduct,
  restoreProduct,
  getProductById,
} from "../controllers/ProductController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Route to get all products (Public)
router.get("/", getAllProducts);

// Route to create a new product (Admin only)
router.post(
  "/create",
  AuthMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  },
  createProduct
);

// Route to delete a product (Admin only)
router.delete(
  "/:productId",
  AuthMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  },
  deleteProduct
);

// Route to hide a product (Admin only)
router.put(
  "/:productId/hide",
  AuthMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  },
  hideProduct
);

// route to restore product (Admin only)
router.put(
  "/:productId/restore",
  AuthMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  },
  restoreProduct
);

router.get("/:productId", getProductById);
export default router;
