import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/register", form);
      dispatch(loginSuccess(res.data));
      toast.success("Registration successful!");
      navigate("/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        className="bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 w-full max-w-md border-t-8 border-orange-500"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2">
            <img className="w-50" src={logo} alt="logo" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm">
            Join and order your favorite food!
          </p>
        </div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="block w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={handleChange}
          value={form.username}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="block w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block w-full mb-5 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={handleChange}
          value={form.password}
          required
        />
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition cursor-pointer">
          Register
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-orange-500 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
