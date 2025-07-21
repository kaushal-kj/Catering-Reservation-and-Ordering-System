import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// User: fetch own orders
export const fetchMyOrders = createAsyncThunk("orders/my", async () => {
  const res = await API.get("/orders/my");
  return res.data.orders;
});

// Admin: fetch all orders
export const fetchAllOrders = createAsyncThunk("orders/all", async () => {
  const res = await API.get("/orders/all");
  return res.data.orders;
});

// Admin: update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }) => {
    const res = await API.put(`/orders/${orderId}/status`, { status });
    return res.data.order;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    allOrders: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.allOrders = state.allOrders.map((order) =>
          order._id === updated._id ? updated : order
        );
      });
  },
});

export default orderSlice.reducer;
