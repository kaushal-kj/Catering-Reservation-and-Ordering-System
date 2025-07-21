import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../features/productSlice";
import API from "../services/api";
import { toast } from "react-toastify";
import { MdMenuBook } from "react-icons/md";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await API.post("/upload", formData);
      setForm({ ...form, imageUrl: res.data.imageUrl });
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct(form));
    toast.success("Product added successfully!");
    setForm({ name: "", description: "", price: "", imageUrl: "" });
  };

  // prevent non-admin access
  if (user?.role !== "admin") {
    return <div className="p-6 text-red-600">Access Denied. Admins only.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 w-full max-w-md border-t-8 border-orange-500 space-y-4"
      >
        <div className="flex flex-col items-center mb-4">
          <span className="text-4xl mb-2">
            <MdMenuBook />
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Add New Product
          </h2>
          <p className="text-gray-500 text-sm">Only admins can add products</p>
        </div>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <input
          type="file"
          onChange={handleImageUpload}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          accept="image/*"
        />
        {uploading && <p className="text-blue-500">Uploading image...</p>}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="h-32 w-32 object-cover rounded border mx-auto"
          />
        )}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition cursor-pointer"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
