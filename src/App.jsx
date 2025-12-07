// src/App.jsx
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Cart from "./Cart";
import Veg from "./Veg";
import Nonveg from "./Nonveg";
import Home from "./Home";
import ContactUs from "./ContactUs";
import Orders from "./Orders";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import LogoutButton from "./LogoutButton";



import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((t, i) => t + i.quantity, 0);

  const auth = useSelector((state) => state.auth);
  const loggedIn = Boolean(auth?.token);

  return (
    <BrowserRouter>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            🍔 Food Court
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto fw-bold align-items-center">

              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Veg Menu
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/veg">
                      All Veg
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Non-Veg Menu
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/nonveg">
                      All Non-Veg
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/contactus">
                  Contact
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link text-warning" to="/cart">
                  🛒 Cart ({cartCount})
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/orders">
                  📦 Orders
                </NavLink>
              </li>

              {!loggedIn && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              )}

              {loggedIn && (
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth.user?.name || auth.user?.email || "User"}
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <LogoutButton />
                    </li>
                  </ul>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>

      {/* Route Content */}
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/nonveg" element={<Nonveg />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
