import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import vegReducer from "../features/menu/vegSlice";
import nonvegReducer from "../features/menu/nonvegSlice";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    veg: vegReducer,
    nonveg: nonvegReducer,
    auth: authReducer,
  },
});

export default store;
