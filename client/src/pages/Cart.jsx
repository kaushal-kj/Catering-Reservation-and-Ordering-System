import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../features/cartSlice";
import API from "../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.info("Your cart is empty!");
      return;
    }
    try {
      await API.post("/orders/", {
        products: items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
        totalPrice,
      });
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border-t-8 border-orange-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-3xl">
            <FaCartArrowDown />
          </span>{" "}
          Your Cart
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">No items in cart.</p>
        ) : (
          <div>
            <ul className="mb-6 divide-y">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-4">
                    {/* Product image visual */}
                    {item.imageUrl && (
                      <Link to={`/product/${item.productId}`}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg border border-orange-100 shadow"
                        />
                      </Link>
                    )}
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium text-gray-800 hover:text-orange-500 transition"
                      >
                        {item.name}
                      </Link>
                      <span className="text-gray-500 ml-2">
                        (x{item.quantity})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-orange-500">
                      ₹{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.productId));
                        toast.info("Item removed from cart.");
                      }}
                      className="cursor-pointer text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg text-gray-700">Total</span>
              <span className="font-bold text-lg text-orange-600">
                ₹{totalPrice}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition text-lg"
            >
              Place Order
            </button>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  dispatch(clearCart());
                  toast.info("Cart cleared.");
                }}
                className="cursor-pointer mt-3 text-gray-500 hover:text-red-500 text-sm underline"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
