import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.items.length);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/veg?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container-fluid">
        {/* LOGO */}
        <span
          className="navbar-brand fw-bold fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          🍔 FoodCourt
        </span>

        {/* TOGGLER FOR MOBILE */}
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

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* Home */}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white"
                id="categoryDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </button>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/veg")}
                  >
                    🥗 Veg
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/nonveg")}
                  >
                    🍗 Non-Veg
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/snacks")}
                  >
                    🍟 Snacks
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/drinks")}
                  >
                    🥤 Drinks
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/desserts")}
                  >
                    🍰 Desserts
                  </button>
                </li>
              </ul>
            </li>

            {/* Contact Page */}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => navigate("/contact")}
              >
                Contact
              </button>
            </li>

            {/* Orders */}
            {isAuthenticated && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => navigate("/orders")}
                >
                  My Orders
                </button>
              </li>
            )}
          </ul>

          {/* SEARCH BAR */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search dishes, restaurants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              🔍
            </button>
          </form>

          {/* CART ICON */}
          <div
            className="position-relative text-white fs-5 me-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/cart")}
          >
            🛒
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                {cartCount}
              </span>
            )}
          </div>

          {/* USER LOGIN / DROPDOWN */}
          {!isAuthenticated ? (
            <div>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-light"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-success dropdown-toggle fw-bold"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ borderRadius: "999px" }}
              >
                👤 {user?.name || "User"}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/orders")}
                  >
                    My Orders
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
