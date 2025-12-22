import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Navbar"; // import navbar
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Veg from "./Veg";
import Nonveg from "./Nonveg";
import Cart from "./Cart";
import Orders from "./Orders";
import Home from "./Home";
import ContactUs from "./ContactUs";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar appears on every page */}
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* AUTH PAGES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* MAIN PAGES */}
        <Route path="/home" element={<Home />} />
        <Route path="/veg" element={<Veg />} />
        <Route path="/nonveg" element={<Nonveg />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contactUS" element={<ContactUs />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
