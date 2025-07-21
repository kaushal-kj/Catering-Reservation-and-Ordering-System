import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  updateEstimatedTime,
  markAsDelivered,
} from "../controllers/OrderController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes below require authentication
router.use(AuthMiddleware);

router.post("/", placeOrder); // Place order
router.get("/my", getMyOrders); // My orders
router.get("/all", getAllOrders); // Admin: all orders
router.put("/:orderId/status", updateOrderStatus);
router.delete("/:orderId", deleteOrder);
router.put("/:id/cancel", AuthMiddleware, cancelOrder);
router.put("/:id/update-time", AuthMiddleware, updateEstimatedTime);
router.put("/:id/delivered", AuthMiddleware, markAsDelivered);

export default router;
