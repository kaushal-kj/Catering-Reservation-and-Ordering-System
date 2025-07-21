import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import { addToCart } from "../features/cartSlice";
import API from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    type: "",
    id: null,
  });

  // Fetch products with all filters
  useEffect(() => {
    dispatch(
      fetchProducts({
        status: filterStatus,
        search,
        minPrice,
        maxPrice,
      })
    );
  }, [dispatch, filterStatus, search, minPrice, maxPrice]);

  // Modal action handlers
  const openModal = (type, id) => setModal({ open: true, type, id });
  const closeModal = () => setModal({ open: false, type: "", id: null });

  const handleModalAction = async () => {
    if (!modal.id) return;
    if (modal.type === "hide") {
      toast.info("Hiding product...", { autoClose: 1500 });
      try {
        await API.put(`/product/${modal.id}/hide`);
        toast.success("Product hidden successfully!");
      } catch {
        toast.error("Failed to hide product. Please try again.");
      }
    }
    if (modal.type === "delete") {
      toast.info("Deleting product...", { autoClose: 1500 });
      try {
        await API.delete(`/product/${modal.id}`);
        toast.success("Product deleted successfully!");
      } catch {
        toast.error("Failed to delete product. Please try again.");
      }
    }
    if (modal.type === "restore") {
      toast.info("Restoring product...", { autoClose: 1500 });
      try {
        await API.put(`/product/${modal.id}/restore`);
        toast.success("Product restored successfully!");
      } catch {
        toast.error("Failed to restore product. Please try again.");
      }
    }
    dispatch(
      fetchProducts({
        status: filterStatus,
        search,
        minPrice,
        maxPrice,
      })
    );
    closeModal();
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Fixed header and filters */}
      <div className="sticky top-8 z-30 bg-orange-50 pb-2 pt-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 px-6 ">
          All Products
        </h2>
        {error && <p className="text-red-500 px-6">{error}</p>}
        {user?.role === "admin" && (
          <div className="mb-2 flex gap-4 px-6">
            {["all", "active", "hidden"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${
                  filterStatus === status
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}
        {/* Filter Button */}
        <div className="mb-2 relative px-6">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 bg-gray-100 p-4 rounded-lg shadow">
              <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Scrollable product grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {loading && <p>Loading...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col"
            >
              <Link to={`/product/${product._id}`}>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded-t-xl"
                  />
                )}
              </Link>
              <div className="flex-1 flex flex-col p-5">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-orange-500 text-lg">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => {
                      dispatch(
                        addToCart({
                          productId: product._id,
                          name: product.name,
                          price: product.price,
                          imageUrl: product.imageUrl,
                        })
                      );
                      toast.success(`${product.name} added to cart!`, {
                        autoClose: 1500,
                      });
                    }}
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow flex items-center gap-2 transition"
                  >
                    <span className="text-lg">
                      <FaCartArrowDown />
                    </span>
                    Add to Cart
                  </button>
                </div>
                {user?.role === "admin" && (
                  <div className="flex space-x-2 mt-4">
                    {product.status === "hidden" ? (
                      <button
                        onClick={() => openModal("restore", product._id)}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full font-semibold text-xs transition"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal("hide", product._id)}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded-full font-semibold text-xs transition"
                      >
                        Hide
                      </button>
                    )}
                    <button
                      onClick={() => openModal("delete", product._id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full font-semibold text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-xs w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {modal.type === "hide" && "Hide Product"}
              {modal.type === "delete" && "Delete Product"}
              {modal.type === "restore" && "Restore Product"}
            </h3>
            <p className="mb-6 text-gray-600">
              {modal.type === "hide" &&
                "Are you sure you want to hide this product from users?"}
              {modal.type === "delete" &&
                "Are you sure you want to permanently delete this product?"}
              {modal.type === "restore" &&
                "Are you sure you want to restore this product to visible list?"}
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
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  modal.type === "delete"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : modal.type === "hide"
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {modal.type === "hide" && "Hide"}
                {modal.type === "delete" && "Delete"}
                {modal.type === "restore" && "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
