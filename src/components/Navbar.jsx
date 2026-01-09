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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm px-3">
      <div className="container-fluid">

        {/* LEFT SIDE : LOGO + LINKS */}
        <div className="d-flex align-items-center gap-4">

          {/* LOGO */}
          <span
            className="navbar-brand fw-bold fs-4 mb-0"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            🍔 FoodCourt
          </span>

          {/* NAV LINKS */}
          <button
            className="btn btn-link nav-link text-white p-0"
            onClick={() => navigate("/veg")}
          >
            🥗 Veg
          </button>

          <button
            className="btn btn-link nav-link text-white p-0"
            onClick={() => navigate("/nonveg")}
          >
            🍗 Non-Veg
          </button>

          <button
            className="btn btn-link nav-link text-white p-0"
            onClick={() => navigate("/contact-us")}
          >
            📞 Contact
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="d-none d-md-block">
            <input
              className="form-control form-control-sm"
              style={{ width: "220px" }}
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* MENU DROPDOWN */}
          <div className="dropdown">
            <button
              className="btn btn-outline-light btn-sm dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ☰ Menu
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">
              {!isAuthenticated ? (
                <>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/login")}
                    >
                      🔐 Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/register")}
                    >
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
            </ul>
          </div>

          {/* CART */}
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

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
