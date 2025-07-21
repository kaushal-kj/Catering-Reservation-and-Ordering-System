import Order from "../models/OrderModel.js";

// Place an order (User)
export const placeOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Order must contain products." });
    }

    const newOrder = new Order({
      userId: req.user.userId,
      products,
      totalPrice,
      estimatedDeliveryTime: "45 minutes",
    });

    await newOrder.save();
    res
      .status(201)
      .json({ success: true, message: "Order placed", order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get all orders of the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate(
      "products.productId"
    );
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const orders = await Order.find()
      .populate("products.productId")
      .populate("userId", "username email");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;

    if (status === "pending") {
      order.estimatedDeliveryTime = 30;
    }
    await order.save();

    res.status(200).json({ success: true, message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

// delete an order (User)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleted = await Order.findOneAndDelete({
      _id: orderId,
      userId: req.user.userId,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });

    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// Cancel an order (User)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // If user is not admin, ensure they can only cancel their own orders
    if (
      req.user.role !== "admin" &&
      order.userId.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

// Update estimated delivery time (Admin)
export const updateEstimatedTime = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can update time." });
    const { estimatedDeliveryTime } = req.body;
    if (typeof estimatedDeliveryTime !== "number") {
      return res.status(400).json({
        message: "Estimated delivery time must be a number (minutes)",
      });
    }
    order.estimatedDeliveryTime = estimatedDeliveryTime;
    await order.save();

    res.status(200).json({ message: "Estimated time updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update time" });
  }
};

// Mark order as delivered (Admin)
export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can mark as delivered." });
    }

    if (order.status === "delivered") {
      return res
        .status(400)
        .json({ message: "Order is already marked as delivered." });
    }

    order.status = "delivered";
    await order.save();

    res.status(200).json({ message: "Order marked as delivered", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};
