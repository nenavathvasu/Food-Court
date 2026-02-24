import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications?.items || []); // assume

  // Mock search suggestions based on input
  const suggestions = search
    ? [
        { name: "Chicken Biryani", category: "Non-Veg" },
        { name: "Paneer Butter Masala", category: "Veg" },
        { name: "Burger", category: "Fast Food" },
        { name: "Pizza", category: "Fast Food" },
      ].filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close suggestions/user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/veg?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/veg?q=${encodeURIComponent(suggestion.name)}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  // Cart animation (optional: add pulse effect when count changes)
  // We'll handle via CSS

  return (
    <>
      <nav className={`modern-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container-fluid px-4 top-row">
          {/* Brand with animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="brand"
            onClick={() => navigate("/home")}
          >
            🍔 FoodCourt
          </motion.div>

          {/* Search with suggestions */}
          <div className="search-wrapper" ref={searchRef}>
            <form onSubmit={handleSearch} className="search-box">
              <input
                type="text"
                placeholder="Search for dishes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  className="suggestions-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {suggestions.map((item, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(item)}>
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-category">{item.category}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div className="actions">
            {/* Notifications */}
            <div className="notification-icon">
              🔔
              {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
              )}
            </div>

            {/* Wishlist */}
            <div className="wishlist-icon" onClick={() => navigate("/wishlist")}>
              ❤️
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </div>

            {/* Cart with animation */}
            <motion.div
              className="cart-icon"
              onClick={() => navigate("/cart")}
              whileTap={{ scale: 0.9 }}
              animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              🛒
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </motion.div>

            {/* User menu / Auth */}
            <div className="user-menu" ref={userMenuRef}>
              {!isAuthenticated ? (
                <button
                  className="btn btn-outline-light btn-sm rounded-pill px-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              ) : (
                <>
                  <div
                    className="user-avatar"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="user-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="user-info">
                          <strong>{user?.name}</strong>
                          <span>{user?.email}</span>
                        </div>
                        <ul>
                          <li onClick={() => navigate("/profile")}>Profile</li>
                          <li onClick={() => navigate("/orders")}>Orders</li>
                          <li onClick={() => navigate("/wishlist")}>Wishlist</li>
                          <li onClick={() => dispatch(logout())}>Logout</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="navbar-toggler custom-toggler"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Desktop bottom menu (visible on lg and up) */}
        <div className="bottom-menu d-none d-lg-block">
          <ul className="menu-list">
            <li><NavLink to="/home" className="menu-link">Home</NavLink></li>
            <li><NavLink to="/veg" className="menu-link">Veg</NavLink></li>
            <li><NavLink to="/nonveg" className="menu-link">Non-Veg</NavLink></li>
            <li><NavLink to="/offers" className="menu-link">Offers</NavLink></li>
            <li><NavLink to="/orders" className="menu-link">Orders</NavLink></li>
            <li><NavLink to="/contact-us" className="menu-link">Contact</NavLink></li>
          </ul>
        </div>
      </nav>

      {/* Mobile offcanvas menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              className="offcanvas-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            <motion.div
              className="offcanvas-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
            >
              <div className="offcanvas-header">
                <span className="brand">🍔 FoodCourt</span>
                <button className="close-btn" onClick={toggleMobileMenu}>✕</button>
              </div>
              <ul className="offcanvas-nav">
                <li><NavLink to="/home" onClick={toggleMobileMenu}>Home</NavLink></li>
                <li><NavLink to="/veg" onClick={toggleMobileMenu}>Veg</NavLink></li>
                <li><NavLink to="/nonveg" onClick={toggleMobileMenu}>Non-Veg</NavLink></li>
                <li><NavLink to="/offers" onClick={toggleMobileMenu}>Offers</NavLink></li>
                <li><NavLink to="/orders" onClick={toggleMobileMenu}>Orders</NavLink></li>
                <li><NavLink to="/contact-us" onClick={toggleMobileMenu}>Contact</NavLink></li>
              </ul>
              {!isAuthenticated ? (
                <button
                  className="btn btn-outline-light w-75 mx-auto mt-4"
                  onClick={() => { toggleMobileMenu(); navigate("/login"); }}
                >
                  Login
                </button>
              ) : (
                <button
                  className="btn btn-danger w-75 mx-auto mt-4"
                  onClick={() => { dispatch(logout()); toggleMobileMenu(); }}
                >
                  Logout
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;