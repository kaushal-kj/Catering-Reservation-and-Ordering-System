import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setUser } from "../features/authSlice";
import API from "../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/user/profile", form);
      dispatch(setUser(res.data.user));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await API.post("/upload", formData);
      setForm({ ...form, profilePic: res.data.imageUrl, role: form.role });
    } catch (err) {
      // alert("Upload failed");
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" bg-orange-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 w-full max-w-md border-t-8 border-orange-500">
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              form.profilePic ||
              "https://res.cloudinary.com/dzooigczp/image/upload/v1745231161/images_1_njlhns.jpg"
            }
            alt="Profile"
            className="h-24 w-24 mt-2 rounded-full mx-auto border"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Username"
            required
          />
          <input
            name="email"
            value={form.email}
            disabled
            className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Email"
            required
          />
          <input
            type="file"
            onChange={handleImageUpload}
            className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            accept="image/*"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
