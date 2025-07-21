import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-center">
      <span className="text-6xl mb-4">😕</span>
      <h1 className="text-4xl font-bold text-red-600 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/products"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
