import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../features/orderSlice";
import { IoFastFood } from "react-icons/io5";
import API from "../services/api";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((state) => state.orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const buttonRefs = useRef({});
  const [modal, setModal] = useState({
    open: false,
    orderId: null,
  });

  const openModal = (id) => setModal({ open: true, orderId: id });
  const closeModal = () => setModal({ open: false, orderId: null });

  const handleCancelConfirmed = async () => {
    try {
      await API.put(`/orders/${modal.orderId}/cancel`);
      dispatch(fetchMyOrders());
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      closeModal();
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      dispatch(fetchMyOrders()); // refresh orders
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to cancel order");
    }
  };

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filteredOrders =
    statusFilter === "all"
      ? myOrders
      : myOrders.filter((order) => order.status === statusFilter);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="sticky top-13 z-30 bg-orange-50 pb-2 pt-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-3xl">
            <IoFastFood />
          </span>{" "}
          My Orders
        </h2>
        <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["all", "pending", "confirmed", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                ref={(el) => (buttonRefs.current[status] = el)}
                onClick={() => {
                  setStatusFilter(status);
                  buttonRefs.current[status]?.scrollIntoView({
                    behavior: "smooth",
                    inline: "start",
                    block: "nearest",
                  });
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
      {myOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500"
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
                <p className="text-green-600 font-bold text-lg mt-2">
                  ₹{order.totalPrice}
                </p>
                {order.status === "confirmed" && (
                  <p>
                    Estimated Delivery:{" "}
                    <span className="font-semibold">
                      {order.estimatedDeliveryTime} minutes
                    </span>
                  </p>
                )}
                {order.status === "pending" && (
                  <button
                    onClick={() => openModal(order._id)}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-full font-semibold text-sm transition"
                  >
                    Cancel Order
                  </button>
                )}
                {/* cancel order modal */}
                {modal.open && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-xs w-full">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">
                        Cancel Order
                      </h3>
                      <p className="mb-6 text-gray-600">
                        Are you sure you want to cancel this order?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={closeModal}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold text-sm transition hover:bg-gray-300"
                        >
                          No, Go Back
                        </button>
                        <button
                          onClick={handleCancelConfirmed}
                          className="px-4 py-2 rounded-full font-semibold text-sm transition bg-red-500 text-white hover:bg-red-600"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
