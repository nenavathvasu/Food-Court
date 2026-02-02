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
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/veg?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm py-2 px-4 sticky-top">
      <span
        className="navbar-brand fw-bold fs-4 text-warning"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/home")}
      >
        🍔 FoodCourt
      </span>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-between" id="mainNavbar">

        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/home")}>Home</span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/veg")}>Veg</span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/nonveg")}>Non-Veg</span>
          </li>
          

          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/offers")}>Offers</span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/orders")}>Orders</span>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => navigate("/contact-us")}>Contact Us</span>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-3">
          <form onSubmit={handleSearch} className="d-none d-lg-block">
            <input
              className="form-control form-control-sm rounded-pill px-3"
              style={{ width: "180px" }}
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div
            className="position-relative text-white fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/cart")}
          >
            🛒
            {cartCount > 0 && (
              <span className="badge bg-warning text-dark position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            )}
          </div>

          <div className="dropdown">
            <button
              className="btn btn-outline-light btn-sm rounded-pill px-3"
              data-bs-toggle="dropdown"
            >
              ☰
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              {!isAuthenticated ? (
                <>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate("/login")}>
                      🔐 Login
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate("/register")}>
                      📝 Register
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => dispatch(logout())}
                  >
                    🚪 Logout
                  </button>
                </li>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => navigate("/profile")}>
                  👤 Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => navigate("/orders")}>
                  📦 My Orders
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
