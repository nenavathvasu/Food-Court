// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import vegReducer from "./vegSlice";
import nonvegReducer from "./nonvegSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    veg: vegReducer,
    nonveg: nonvegReducer,
    auth: authReducer,
  },
});

export default store;
