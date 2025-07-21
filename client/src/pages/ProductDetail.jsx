import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { toast } from "react-toastify";
import { FaCartArrowDown } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data);
      } catch {
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl w-full">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {product.name}
        </h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-orange-500 text-xl">
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
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow flex items-center gap-2 transition"
          >
            <span className="text-lg">
              <FaCartArrowDown />
            </span>
            Add to Cart
          </button>
        </div>
        <div className="text-sm text-gray-500">
          <span>Status: </span>
          <span
            className={
              product.status === "active"
                ? "text-green-600"
                : product.status === "hidden"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {product.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
