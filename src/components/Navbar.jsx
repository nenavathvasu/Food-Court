// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/veg?q=${encodeURIComponent(search.trim())}`);
    setSearch(""); // clear after search
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">🍔 Food Court</Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>

            {/* Dropdown for Menu */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/veg">Veg 🥗</Link></li>
                <li><Link className="dropdown-item" to="/nonveg">Non-Veg 🍖</Link></li>
                <li><Link className="dropdown-item" to="/snacks">Snacks 🍟</Link></li>
                <li><Link className="dropdown-item" to="/drinks">Drinks 🥤</Link></li>
                <li><Link className="dropdown-item" to="/desserts">Desserts 🍰</Link></li>
                <li><Link className="dropdown-item" to="/south">South Indian 🥘</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/orders">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>
          </ul>

          {/* Search bar */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search food..."
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-light text-danger" type="submit">Search</button>
          </form>

          {/* Login/Register buttons */}
          <div className="d-flex">
            <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
            <Link className="btn btn-light text-danger" to="/register">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
