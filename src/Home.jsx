// Home.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("veg");
  const navigate = useNavigate();

  const themeColor = "#dc3545"; // fixed color for hero and buttons

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/${category}?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <div className="hero-container" style={{ backgroundColor: themeColor }}>
        <div className="hero-overlay"></div>

        <div className="hero-content text-center text-white">
          <h1 className="fw-bold hero-title" style={{ fontSize: "2rem" }}>
            🍔 Order the best food in your city 🍕
          </h1>
          <p className="hero-sub" style={{ fontSize: "1rem" }}>
            🚀 Fast Delivery • 🌟 Best Restaurants • 😋 Tasty Meals
          </p>

          {/* SEARCH BAR */}
          <form className="search-wrapper" onSubmit={handleSearch}>
            <div className="location-box">
              <i className="bi bi-geo-alt-fill text-white"></i>
              <input
                type="text"
                placeholder="Enter delivery location"
                defaultValue="Hyderabad, Telangana"
                readOnly
              />
            </div>

            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search for food or restaurants"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="veg">🥦 Veg</option>
              <option value="nonveg">🍗 Non-Veg</option>
            </select>

            <button className="btn px-4 btn-theme">🔍 Search</button>
          </form>
        </div>
      </div>

      {/* ===================== QUICK FEATURES ===================== */}
      <section className="container py-4">
        <h3 className="fw-bold mb-4">What would you like to do? 🍽️</h3>

        <div className="row g-4 text-center">
          {[
            {
              icon: "bi-bag-check",
              title: "Order Food 🍲",
              desc: "Get hot & fresh meals delivered",
              bg: "linear-gradient(135deg, #fbc2eb, #a6c1ee)"
            },
            {
              icon: "bi-cup-straw",
              title: "Drinks 🥤",
              desc: "Juices, shakes & beverages",
              bg: "linear-gradient(135deg, #fdd6bd, #fbc4ab)"
            },
            {
              icon: "bi-emoji-smile",
              title: "Snacks 🍿",
              desc: "Quick bites you love",
              bg: "linear-gradient(135deg, #cfd9df, #e2ebf0)"
            },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <div
                className="quick-card-modern shadow-sm hover-animate"
                style={{
                  background: item.bg,
                  borderRadius: "12px",
                  padding: "20px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
              >
                <i
                  className={`bi ${item.icon} quick-feature-icon`}
                  style={{ fontSize: "2rem" }}
                ></i>
                <h5 className="fw-bold mt-2">{item.title}</h5>
                <p className="text-muted small">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FOOD CATEGORIES ===================== */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4">Eat What Makes You Happy 😍</h3>

        <div className="row g-3 text-center">
          {[
            { name: "Veg 🥗", path: "/veg", bg: "#d0f0c0" },
            { name: "Non-Veg 🍖", path: "/nonveg", bg: "#f8d7da" },
            { name: "Snacks 🍟", path: "/snacks", bg: "#fff3cd" },
            { name: "Drinks 🥤", path: "/drinks", bg: "#d1ecf1" },
            { name: "Desserts 🍰", path: "/desserts", bg: "#f5c6cb" },
            { name: "South Indian 🥘", path: "/south", bg: "#c3e6cb" },
          ].map((cat, i) => (
            <div className="col-6 col-md-2" key={i}>
              <Link className="food-cat-card text-decoration-none" to={cat.path}>
                <div
                  className="food-cat-box shadow-sm hover-animate"
                  style={{
                    backgroundColor: cat.bg,
                    borderRadius: "12px",
                    padding: "20px 0",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                  }}
                >
                  <p className="fw-bold">{cat.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== STORE ADDRESS ===================== */}
      <section className="store-section text-center py-5">
        <h4 className="fw-bold mb-2">📍 Our Store Address</h4>
        <p className="text-muted mb-1">Food Court, 2nd Floor</p>
        <p className="text-muted mb-1">INDIRA NAGAR, RAMANTHAPUR</p>
        <p className="text-muted mb-1">Hyderabad, Telangana - 500013</p>
        <p className="fw-bold mt-2">🕒 Open: 10 AM - 11 PM</p>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer-container text-white py-4" style={{ backgroundColor: themeColor }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">About</h6>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contactus">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/veg">Veg Menu</Link></li>
                <li><Link to="/nonveg">Non-Veg Menu</Link></li>
                <li><Link to="/orders">Your Orders</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/refund">Refund Policy</Link></li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="social-icons">
                <i className="bi bi-facebook"></i>
                <i className="bi bi-instagram"></i>
                <i className="bi bi-twitter"></i>
              </div>
              {/* Newsletter Signup */}
              <div className="mt-2">
                <input
                  type="email"
                  placeholder="Subscribe for updates ✉️"
                  className="form-control form-control-sm"
                />
                <button className="btn btn-light btn-sm mt-1">Subscribe</button>
              </div>
            </div>
          </div>

          <p className="text-center mt-3 small">
            © {new Date().getFullYear()} Food Court • Designed with ❤️
          </p>
        </div>
      </footer>

      {/* ===================== STYLES ===================== */}
      <style>
        {`
          .hover-animate {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-animate:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          }

          .btn-theme {
            background-color: ${themeColor};
            color: white;
            border: none;
            transition: transform 0.3s ease;
          }
          .btn-theme:hover {
            transform: scale(1.05);
          }

          body {
            font-size: 0.95rem;
          }
        `}
      </style>
    </>
  );
}

export default Home;
