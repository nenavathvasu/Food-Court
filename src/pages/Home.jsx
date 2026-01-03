// Home.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("veg");
  const navigate = useNavigate();
  const themeColor = "#dc3545";

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/${category}?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <header className="bg-danger text-white py-5 position-relative">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">🍔 Order the Best Food in Your City 🍕</h1>
          <p className="lead">🚀 Fast Delivery • 🌟 Best Restaurants • 😋 Tasty Meals</p>

          {/* Search Form */}
          <form className="d-flex justify-content-center mt-4 flex-wrap" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2 mb-2"
              placeholder="Search for food or restaurants"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: "300px" }}
            />
            <select
              className="form-select me-2 mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="veg">🥦 Veg</option>
              <option value="nonveg">🍗 Non-Veg</option>
            </select>
            <button type="submit" className="btn btn-light text-danger mb-2">
              🔍 Search
            </button>
          </form>
        </div>
        <div
          className="position-absolute w-100 h-100 top-0 start-0"
          style={{
            background: "rgba(0,0,0,0.3)",
            zIndex: 0
          }}
        ></div>
      </header>

      {/* ================= QUICK FEATURES ================= */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4 text-center">What Would You Like to Do? 🍽️</h3>
        <div className="row g-4 justify-content-center">
          {[
            { icon: "bi-bag-check", title: "Order Food", desc: "Get hot & fresh meals delivered", bg: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", path: "/veg" },
            { icon: "bi-cup-straw", title: "Drinks", desc: "Juices, shakes & beverages", bg: "linear-gradient(135deg, #fdd6bd, #fbc4ab)", path: "/drinks" },
            { icon: "bi-emoji-smile", title: "Snacks", desc: "Quick bites you love", bg: "linear-gradient(135deg, #cfd9df, #e2ebf0)", path: "/snacks" }
          ].map((item, i) => (
            <div className="col-12 col-md-4" key={i}>
              <div
                className="card text-center shadow-sm hover-animate"
                style={{ background: item.bg, borderRadius: "15px", cursor: "pointer" }}
                onClick={() => navigate(item.path)}
              >
                <div className="card-body">
                  <i className={`bi ${item.icon} mb-3`} style={{ fontSize: "2rem" }}></i>
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOD CATEGORIES ================= */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4 text-center">Eat What Makes You Happy 😍</h3>
        <div className="row g-3 justify-content-center">
          {[
            { name: "Veg 🥗", path: "/veg", bg: "#d0f0c0" },
            { name: "Non-Veg 🍖", path: "/nonveg", bg: "#f8d7da" },
            { name: "Snacks 🍟", path: "/snacks", bg: "#fff3cd" },
            { name: "Drinks 🥤", path: "/drinks", bg: "#d1ecf1" },
            { name: "Desserts 🍰", path: "/desserts", bg: "#f5c6cb" },
            { name: "South Indian 🥘", path: "/south", bg: "#c3e6cb" }
          ].map((cat, i) => (
            <div className="col-6 col-md-2" key={i}>
              <Link to={cat.path} className="text-decoration-none">
                <div
                  className="card shadow-sm hover-animate text-center p-3"
                  style={{ backgroundColor: cat.bg, borderRadius: "12px" }}
                >
                  <p className="fw-bold mb-0">{cat.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STORE ADDRESS ================= */}
      <section className="bg-light py-5 text-center">
        <h4 className="fw-bold mb-2">📍 Our Store Address</h4>
        <p className="mb-1">Food Court, 2nd Floor</p>
        <p className="mb-1">INDIRA NAGAR, RAMANTHAPUR</p>
        <p className="mb-1">Hyderabad, Telangana - 500013</p>
        <p className="fw-bold mt-2">🕒 Open: 10 AM - 11 PM</p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-danger text-white py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">About</h6>
              <ul className="list-unstyled">
                <li><Link to="/about" className="text-white">About Us</Link></li>
                <li><Link to="/contactus" className="text-white">Contact</Link></li>
                <li><Link to="/privacy" className="text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/veg" className="text-white">Veg Menu</Link></li>
                <li><Link to="/nonveg" className="text-white">Non-Veg Menu</Link></li>
                <li><Link to="/orders" className="text-white">Your Orders</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                <li><Link to="/help" className="text-white">Help Center</Link></li>
                <li><Link to="/terms" className="text-white">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="text-white">Refund Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-3 text-center">
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <i className="bi bi-facebook fs-5"></i>
                <i className="bi bi-instagram fs-5"></i>
                <i className="bi bi-twitter fs-5"></i>
              </div>
              <div className="d-flex gap-2 justify-content-center">
                <input type="email" className="form-control form-control-sm" placeholder="Subscribe ✉️"/>
                <button className="btn btn-light btn-sm text-danger">Subscribe</button>
              </div>
            </div>
          </div>
          <p className="text-center mt-3 small">© {new Date().getFullYear()} Food Court • Designed with ❤️</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
