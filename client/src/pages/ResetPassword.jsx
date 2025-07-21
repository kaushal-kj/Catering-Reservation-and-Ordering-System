import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(resetPassword({ token, newPassword }));
    toast.success("Password reset successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Reset Password
        </h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
