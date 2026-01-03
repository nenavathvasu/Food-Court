// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";


import Cart from "./features/cart/Cart";

import ContactUs from "./pages/ContactUs";


import Veg from "./features/menu/Veg";
import Nonveg from "./features/menu/NonVeg";
import Orders from "./features/orders/Orders";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar on all pages */}

      <Routes>
        {/* Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/veg" element={<Veg />} />
        <Route path="/nonveg" element={<Nonveg />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
