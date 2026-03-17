// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../features/auth/authSlice";
import { clearOrders } from "../features/orders/orderSlice";
import "../styles/navbar.css";

const SUGGESTIONS = [
  { name: "Chicken Biryani",      category: "Non-Veg", route: "/nonveg" },
  { name: "Paneer Butter Masala", category: "Veg",     route: "/veg"    },
  { name: "Grilled Burger",       category: "Fast Food",route: "/veg"   },
  { name: "Masala Dosa",          category: "Veg",     route: "/veg"    },
  { name: "Fish Curry",           category: "Non-Veg", route: "/nonveg" },
  { name: "Mutton Biryani",       category: "Non-Veg", route: "/nonveg" },
  { name: "Veg Biryani",          category: "Veg",     route: "/veg"    },
  { name: "Chicken Wings",        category: "Non-Veg", route: "/nonveg" },
  { name: "Dal Makhani",          category: "Veg",     route: "/veg"    },
  { name: "Panner Tikka",         category: "Veg",     route: "/veg"    },
];

const NAV_LINKS = [
  { to: "/home",       label: "Home" },
  { to: "/veg",        label: "Veg" },
  { to: "/nonveg",     label: "Non‑Veg" },
  { to: "/offers",     label: "Offers" },
  { to: "/orders",     label: "Orders" },
  { to: "/contact-us", label: "Contact" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [search,         setSearch]         = useState("");
  const [scrolled,       setScrolled]       = useState(false);
  const [showSugg,       setShowSugg]       = useState(false);
  const [showUserMenu,   setShowUserMenu]   = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const searchRef  = useRef(null);
  const userRef    = useRef(null);

  const cartCount      = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount  = useSelector((s) => s.wishlist?.items?.length || 0);
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const filtered = search
    ? SUGGESTIONS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Scroll handler
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Click outside handler
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false);
      if (userRef.current   && !userRef.current.contains(e.target))   setShowUserMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const NON_VEG_KEYWORDS = ["chicken", "mutton", "fish", "prawn", "egg", "meat", "beef", "pork", "lamb", "kebab", "grill"];

  const getRoute = (query) => {
    const q = query.toLowerCase();
    return NON_VEG_KEYWORDS.some(k => q.includes(k)) ? "/nonveg" : "/veg";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const route = getRoute(search.trim());
    navigate(`${route}?q=${encodeURIComponent(search.trim())}`);
    setSearch(""); setShowSugg(false);
  };

  const handleSuggClick = (sugg) => {
    navigate(`${sugg.route}?q=${encodeURIComponent(sugg.name)}`);
    setSearch(""); setShowSugg(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container navbar__inner">

          {/* Brand */}
          <div className="navbar__brand" onClick={() => navigate("/home")}>
            <div className="navbar__brand-icon">🍔</div>
            <span>FoodCourt</span>
          </div>

          {/* Desktop nav */}
          <nav className="navbar__links">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <div className="navbar__search" ref={searchRef}>
            <form onSubmit={handleSearch} style={{ position: "relative" }}>
              <i className="bi bi-search navbar__search-icon" />
              <input
                className="navbar__search-input"
                type="text"
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSugg(true); }}
                onFocus={() => setShowSugg(true)}
              />
            </form>
            <AnimatePresence>
              {showSugg && filtered.length > 0 && (
                <motion.div className="navbar__suggestions"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {filtered.map((s, i) => (
                    <div key={i} className="navbar__suggestion" onClick={() => handleSuggClick(s)}>
                      <span>{s.name}</span>
                      <span className="navbar__suggestion-cat">{s.category}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            {/* Wishlist */}
            <button className="navbar__action-btn" title="Wishlist" onClick={() => navigate("/wishlist")}>
              <i className="bi bi-heart" />
              {wishlistCount > 0 && <span className="count">{wishlistCount}</span>}
            </button>

            {/* Cart */}
            <button className="navbar__action-btn" title="Cart" onClick={() => navigate("/cart")}>
              <i className="bi bi-bag" />
              {cartCount > 0 && <span className="count">{cartCount}</span>}
            </button>

            {/* User */}
            <div className="navbar__user" ref={userRef}>
              {!isAuthenticated ? (
                <button className="btn btn-primary btn-sm btn-pill"
                  onClick={() => navigate("/login")}>Login</button>
              ) : (
                <>
                  <div className="navbar__avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} />
                      : <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>}
                  </div>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div className="navbar__user-dropdown"
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <div className="navbar__user-info">
                          <strong>{user?.name}</strong>
                          <span>{user?.email}</span>
                        </div>
                        {[
                          { label: "Profile", icon: "bi-person", path: "/profile" },
                          { label: "My Orders", icon: "bi-bag-check", path: "/orders" },
                          { label: "Wishlist", icon: "bi-heart", path: "/wishlist" },
                        ].map(({ label, icon, path }) => (
                          <button key={path} className="navbar__user-menu-item"
                            onClick={() => { setShowUserMenu(false); navigate(path); }}>
                            <i className={`bi ${icon}`} /> {label}
                          </button>
                        ))}
                        <button className="navbar__user-menu-item danger"
                          onClick={() => { dispatch(clearOrders()); dispatch(logout()); }}>
                          <i className="bi bi-box-arrow-right" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button className="navbar__toggler" onClick={() => setShowMobileMenu(true)}>
              <i className="bi bi-list" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile offcanvas */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div className="navbar__backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)} />
            <motion.div className="navbar__offcanvas"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}>
              <div className="navbar__offcanvas-header">
                <div className="navbar__brand" onClick={() => { navigate("/home"); setShowMobileMenu(false); }}>
                  <div className="navbar__brand-icon">🍔</div>
                  <span>FoodCourt</span>
                </div>
                <button className="btn-icon" onClick={() => setShowMobileMenu(false)}>
                  <i className="bi bi-x" />
                </button>
              </div>

              <nav className="navbar__offcanvas-links">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) => `navbar__offcanvas-link${isActive ? " active" : ""}`}
                    onClick={() => setShowMobileMenu(false)}>
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="navbar__offcanvas-footer">
                {!isAuthenticated ? (
                  <button className="btn btn-primary btn-block btn-pill"
                    onClick={() => { setShowMobileMenu(false); navigate("/login"); }}>
                    Login
                  </button>
                ) : (
                  <button className="btn btn-ghost btn-block btn-pill"
                    style={{ color: "var(--primary)" }}
                    onClick={() => { dispatch(clearOrders()); dispatch(logout()); setShowMobileMenu(false); }}>
                    <i className="bi bi-box-arrow-right" style={{ marginRight: 6 }} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}