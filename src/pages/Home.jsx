import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="fw-bold display-5">Delicious food, delivered to your door 🚀</h1>
          <p className="text-muted">Order from your favorite restaurants near you</p>

          <div className="row justify-content-center mt-4">
            <div className="col-md-6">
              <div className="input-group input-group-lg shadow-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for dishes or restaurants..."
                />
                <button
                  className="btn btn-danger"
                  onClick={() => navigate("/veg")}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OFFERS ================= */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4">🔥 Today’s Offers</h3>
        <div className="row g-4">
          {["50% Off up to ₹100", "Free Delivery on First Order", "₹75 Cashback via UPI"].map((offer, i) => (
            <div className="col-md-4" key={i}>
              <div className="card bg-danger text-white shadow h-100">
                <div className="card-body text-center">
                  <h5 className="fw-bold">{offer}</h5>
                  <button
                    className="btn btn-light btn-sm mt-2"
                    onClick={() => navigate("/veg")}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POPULAR DISHES ================= */}
      <section className="container py-5">
        <h3 className="fw-bold mb-4 text-center">🍽 Popular Dishes</h3>
        <div className="row g-4">
          {[
            { name: "Paneer Butter Masala", price: "₹220", path: "/veg" },
            { name: "Chicken Biryani", price: "₹280", path: "/nonveg" },
            { name: "Veg Burger", price: "₹120", path: "/snacks" },
            { name: "Cold Coffee", price: "₹90", path: "/drinks" }
          ].map((item, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h6 className="fw-bold">{item.name}</h6>
                  <p className="text-success fw-bold">{item.price}</p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => navigate(item.path)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center g-4">
            {[
              { icon: "🚀", title: "Fast Delivery" },
              { icon: "🍴", title: "100+ Restaurants" },
              { icon: "💳", title: "Secure Payments" },
              { icon: "⭐", title: "Top Rated" }
            ].map((f, i) => (
              <div className="col-md-3" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="fs-1">{f.icon}</div>
                    <h5 className="fw-bold mt-2">{f.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APP DOWNLOAD ================= */}
      <section className="container py-5 text-center">
        <h3 className="fw-bold">Get the FoodCourt App 📱</h3>
        <p className="text-muted">Order faster & track delivery in real-time</p>
        <button className="btn btn-dark me-2">Google Play</button>
        <button className="btn btn-dark">App Store</button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-1">📍 Hyderabad | 🕒 10 AM – 11 PM</p>
        <p className="small mb-0">
          © {new Date().getFullYear()} FoodCourt. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Home;