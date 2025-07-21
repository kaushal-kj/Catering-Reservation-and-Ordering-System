import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../features/orderSlice";
import { toast } from "react-toastify";
import { MdFoodBank } from "react-icons/md";
import API from "../services/api";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [estimateInputs, setEstimateInputs] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState({
    open: false,
    orderId: null,
  });

  // Handle updating estimated delivery time
  const handleUpdateEstimate = async (orderId, newEstimate) => {
    if (!newEstimate) {
      toast.error("Please enter an estimate (e.g., 30 minutes)");
      return;
    }
    const estimateNumber = Number(newEstimate);
    if (isNaN(estimateNumber) || estimateNumber < 1) {
      toast.error("Please enter a valid number of minutes");
      return;
    }

    try {
      await API.put(`/orders/${orderId}/update-time`, {
        estimatedDeliveryTime: estimateNumber,
      });
      dispatch(fetchAllOrders());
      toast.success("Updated successfully");
      setEstimateInputs((prev) => ({ ...prev, [orderId]: "" }));
    } catch (err) {
      toast.error("Failed to update estimate");
    }
  };

  // Handle modal close and action
  const closeModal = () => setModal({ open: false, orderId: null });
  const handleModalAction = async () => {
    try {
      await API.put(`/orders/${modal.orderId}/delivered`);
      dispatch(fetchAllOrders());
      toast.success("Order marked as delivered!");
    } catch (err) {
      toast.error("Failed to mark as delivered");
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (user?.role !== "admin")
    return <p className="p-6 text-red-500">Access Denied.</p>;

  const handleStatusChange = async (orderId, status) => {
    await dispatch(updateOrderStatus({ orderId, status }));
    dispatch(fetchAllOrders());
  };
  const filteredOrders =
    statusFilter === "all"
      ? allOrders
      : allOrders.filter((order) => order.status === statusFilter);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="sticky top-13 z-30 bg-orange-50 pb-2 pt-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-3xl">
            <MdFoodBank />
          </span>{" "}
          All Orders
        </h2>
        <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["all", "pending", "confirmed", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-1 rounded-full font-semibold border transition ${
                  statusFilter === status
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {allOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-700">
                    Order{" "}
                    <span className="text-orange-500">
                      #{order._id.slice(-5)}
                    </span>
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "delivered"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  User:{" "}
                  <span className="font-medium">{order.userId?.username}</span>
                </p>
                <ul className="text-sm text-gray-700 mb-1">
                  {order.products.map((p, i) => (
                    <li key={i}>
                      <Link
                        to={`/product/${p.productId?._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {p.productId?.name}
                      </Link>{" "}
                      × {p.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-green-600 font-bold text-lg mt-1">
                  ₹{order.totalPrice}
                </p>
                {order.status === "confirmed" && (
                  <p className="text-sm text-gray-600 mb-1">
                    Estimated Delivery:{" "}
                    <span className="font-semibold">
                      {order.estimatedDeliveryTime}
                    </span>
                  </p>
                )}
                <div className="mt-2 flex flex-col gap-2">
                  {order.status !== "delivered" && (
                    <div>
                      <label className="text-sm font-medium mr-2">
                        Update Status:
                      </label>
                      <select
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-400"
                        value={order.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                  {user?.role === "admin" && order.status === "confirmed" && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Minutes"
                        value={estimateInputs[order._id] || ""}
                        onChange={(e) =>
                          setEstimateInputs((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 rounded text-sm"
                      />
                      <button
                        onClick={() =>
                          handleUpdateEstimate(
                            order._id,
                            estimateInputs[order._id]
                          )
                        }
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Update Time
                      </button>
                    </div>
                  )}
                  {user?.role === "admin" &&
                    order.status === "confirmed" &&
                    order.status !== "delivered" && (
                      <button
                        onClick={() =>
                          setModal({ open: true, orderId: order._id })
                        }
                        className="text-green-600 hover:underline text-sm"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  {/* modal for mark delivered */}
                  {modal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-xs w-full">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">
                          Mark as Delivered
                        </h3>
                        <p className="mb-6 text-gray-600">
                          Are you sure you want to mark this order as delivered?
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={closeModal}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold text-sm transition hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleModalAction}
                            className="px-4 py-2 rounded-full font-semibold text-sm transition bg-green-500 text-white hover:bg-green-600"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
