import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md sticky top-0 z-50">
        <Link to="/products" className="flex items-center gap-2">
          <img className="w-30" src={logo} alt="logo" />
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 ">
          <li>
            <Link
              to="/products"
              className={`hover:text-orange-500 font-medium ${
                isActive("/products")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={`hover:text-orange-500 font-medium flex items-center ${
                isActive("/cart")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/my-orders"
              className={`hover:text-orange-500 font-medium ${
                isActive("/my-orders")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
            >
              Orders
            </Link>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  to="/add-product"
                  className={`hover:text-orange-500 font-medium ${
                    isActive("/add-product")
                      ? "underline underline-offset-4 text-orange-500"
                      : ""
                  }`}
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className={`hover:text-orange-500 font-medium ${
                    isActive("/admin/orders")
                      ? "underline underline-offset-4 text-orange-500"
                      : ""
                  }`}
                >
                  Admin Orders
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/profile"
              className={`hover:text-orange-500 font-medium ${
                isActive("/profile")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline font-medium cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <ul className=" md:hidden flex flex-col items-center gap-2 px-5 py-4 bg-gray-50 shadow-lg fixed top-[54px] left-0 w-full z-50 ">
          <li>
            <Link
              to="/products"
              className={`hover:text-orange-500 font-medium ${
                isActive("/products")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={`hover:text-orange-500 font-medium flex items-center ${
                isActive("/cart")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/my-orders"
              className={`hover:text-orange-500 font-medium ${
                isActive("/my-orders")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Orders
            </Link>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  to="/add-product"
                  className={`hover:text-orange-500 font-medium ${
                    isActive("/add-product")
                      ? "underline underline-offset-4 text-orange-500"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className={`hover:text-orange-500 font-medium ${
                    isActive("/admin/orders")
                      ? "underline underline-offset-4 text-orange-500"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Orders
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/profile"
              className={`hover:text-orange-500 font-medium ${
                isActive("/profile")
                  ? "underline underline-offset-4 text-orange-500"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-500 hover:underline font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Navbar;
