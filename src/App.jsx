// src/App.jsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar       from "./components/Navbar";
import Home         from "./pages/Home";
import AboutUs      from "./pages/AboutUs";
import ContactUs    from "./pages/ContactUs";
import Veg          from "./features/menu/Veg";
import NonVeg       from "./features/menu/NonVeg";
import Cart         from "./features/cart/Cart";
import Orders       from "./features/orders/Orders";
import LoginPage    from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import Offers      from "./pages/Offers";
import Profile     from "./pages/Profile";
import Wishlist    from "./features/wishlist/Wishlist";
import Payment     from "./features/payment/Payment";

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"           element={<Navigate to="/home" replace />} />
            <Route path="/home"       element={<Home />} />
            <Route path="/veg"        element={<Veg />} />
            <Route path="/nonveg"     element={<NonVeg />} />
            <Route path="/cart"       element={<Cart />} />
            <Route path="/orders"     element={<Orders />} />
            <Route path="/about"      element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/offers"     element={<Offers />} />
            <Route path="/profile"    element={<Profile />} />
            <Route path="/wishlist"   element={<Wishlist />} />
            <Route path="/payment"    element={<Payment />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="*"           element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}