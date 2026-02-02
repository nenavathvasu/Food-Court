import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/orderSlice"; // lowercase 'orders'
import vegReducer from "../features/menu/vegSlice";
import nonvegReducer from "../features/menu/nonvegSlice";
import authReducer from "../features/auth/authSlice";


const store = configureStore({
  reducer: {
    cart: cartReducer,     // cart items and placeOrder
    orders: ordersReducer, // allOrders
    veg: vegReducer,       // veg menu
    nonveg: nonvegReducer, // non-veg menu
    auth: authReducer,     // login/register
  },
});

export default store;