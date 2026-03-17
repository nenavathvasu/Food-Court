// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer     from "../features/cart/cartSlice";
import ordersReducer   from "../features/orders/orderSlice";
import vegReducer      from "../features/menu/vegSlice";
import nonvegReducer   from "../features/menu/nonvegSlice";
import authReducer     from "../features/auth/authSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import paymentReducer  from "../features/payment/paymentSlice";

const store = configureStore({
  reducer: {
    cart:     cartReducer,
    orders:   ordersReducer,
    veg:      vegReducer,
    nonveg:   nonvegReducer,
    auth:     authReducer,
    wishlist: wishlistReducer,
    payment:  paymentReducer,
  },
});

export default store;