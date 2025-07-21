import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/MongoDB.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import errorHandler from "./middleware/ErrorMiddleware.js";
import UploadRoute from "./routes/UploadRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/user", UserRoute);

app.use("/api/product", ProductRoute);

app.use("/api/orders", OrderRoute);

app.use("/api/upload", UploadRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
