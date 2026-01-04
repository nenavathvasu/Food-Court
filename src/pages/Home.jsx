// Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">

          <div className="carousel-item active bg-danger text-white py-5">
            <div className="container text-center">
              <h1 className="fw-bold">🍔 Delicious Food, Delivered Fast</h1>
              <p className="lead">Order from the best restaurants near you</p>
              <button
                className="btn btn-light btn-lg text-danger mt-3"
                onClick={() => navigate("/veg")}
              >
                Order Now
              </button>
            </div>
          </div>

          <div className="carousel-item bg-dark text-white py-5">
            <div className="container text-center">
              <h1 className="fw-bold">🥗 Fresh & Healthy Meals</h1>
              <p className="lead">Veg & Non-Veg options available</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= TOP PICKS TODAY ================= */}
      <section className="container py-5">
        <h3 className="fw-bold text-center mb-4">🔥 Top Picks Today</h3>

        <div className="row g-4">
          {[
            { name: "Paneer Butter Masala 🧀", price: "₹220", path: "/veg" },
            { name: "Chicken Biryani 🍗", price: "₹280", path: "/nonveg" },
            { name: "Veg Burger 🍔", price: "₹120", path: "/snacks" },
            { name: "Chocolate Dessert 🍰", price: "₹150", path: "/desserts" }
          ].map((item, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="fw-bold">{item.name}</h6>
                  <span className="badge bg-success mb-2">{item.price}</span>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => navigate(item.path)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container py-5">
        <div className="row text-center g-4">
          {[
            { icon: "🚀", title: "Fast Delivery" },
            { icon: "⭐", title: "Top Restaurants" },
            { icon: "💳", title: "Secure Payments" },
            { icon: "📞", title: "24/7 Support" }
          ].map((f, i) => (
            <div className="col-md-3" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="fs-1">{f.icon}</div>
                  <h5 className="fw-bold mt-2">{f.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="bg-light py-5">
        <div className="container">
          <h3 className="text-center fw-bold mb-4">Explore Categories 🍽️</h3>
          <div className="row g-3 justify-content-center">
            {[
              { name: "Veg 🥗", path: "/veg" },
              { name: "Non-Veg 🍖", path: "/nonveg" },
              { name: "Snacks 🍟", path: "/snacks" },
              { name: "Drinks 🥤", path: "/drinks" },
              { name: "Desserts 🍰", path: "/desserts" }
            ].map((c, i) => (
              <div className="col-6 col-md-2" key={i}>
                <Link to={c.path} className="text-decoration-none">
                  <div className="card text-center shadow-sm py-3 h-100">
                    <h6 className="fw-bold">{c.name}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT US ================= */}
      <section className="container py-5 text-center">
        <h3 className="fw-bold mb-3">Need Help? 🤝</h3>
        <p className="text-muted">
          Have questions or feedback? We’d love to hear from you.
        </p>
        <Link to="/contact-us" className="btn btn-outline-danger btn-lg">
          Contact Us
        </Link>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-danger text-white text-center py-5">
        <h2 className="fw-bold">Hungry? Let’s Fix That 😋</h2>
        <p>Browse menus and enjoy delicious food today</p>
        <button
          className="btn btn-light btn-lg text-danger"
          onClick={() => navigate("/veg")}
        >
          Order Now
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-4 text-center">
        <p className="mb-1">📍 Hyderabad • 🕒 10 AM – 11 PM</p>
        <p className="small mb-0">
          © {new Date().getFullYear()} Food Court
        </p>
      </footer>
    </>
  );
}

export default Home;
