import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-modern">
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="hero-tag">Fresh & Fast Delivery</span>
            <h1>Delicious Food Delivered To Your Door 🚀</h1>
            <p>Top restaurants • Hygienic kitchens • Best prices</p>

            <div className="search-bar-modern">
              <input type="text" placeholder="Enter your location" />
              <input type="text" placeholder="Search dishes or restaurants" />
              <button onClick={() => navigate("/veg")}>Search</button>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              alt="food"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES STRIP ================= */}
      <section className="features-modern">
        <div className="container feature-flex">
          <div>🚀 30 Min Delivery</div>
          <div>🛡 Hygiene Certified</div>
          <div>💳 Secure Payments</div>
          <div>🎁 Daily Offers</div>
        </div>
      </section>

      <section className="container py-5">
  <h3 className="section-title">Explore Categories</h3>

  <div className="category-scroll">
    {[
      {
        name: "Veg",
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        path: "/veg"
      },
      {
        name: "Non-Veg",
        img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        path: "/nonveg"
      },
      
      {
        name: "Drinks",
        img: "https://images.unsplash.com/photo-1497534446932-c925b458314e",
        path: "/drinks"
      }
    ].map((cat, i) => (
      <div
        key={i}
        className="category-card"
        onClick={() => navigate(cat.path)}
      >
        <img src={cat.img} alt={cat.name} />
        <span>{cat.name}</span>
      </div>
    ))}
  </div>
</section>


      {/* ================= OFFERS ================= */}
      <section className="container py-4">
        <h3 className="section-title">🔥 Today’s Offers</h3>
        <div className="row g-4">
          {["50% OFF", "Free Delivery", "₹100 Cashback"].map((offer, i) => (
            <div className="col-md-4" key={i}>
              <div className="offer-modern">
                <h5>{offer}</h5>
                <p>⏳ Ends in 02:14:36</p>
                <button>Order Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED RESTAURANTS ================= */}
      <section className="container py-5">
        <h3 className="section-title">⭐ Featured Restaurants</h3>
        <div className="row g-4">
          {[1, 2, 3, 4].map((r) => (
            <div className="col-md-3" key={r}>
              <div className="restaurant-modern">
                <h6>Restaurant {r}</h6>
                <p>⭐ 4.{r} • 30 mins 🚀</p>
                <span>FSSAI Certified 🛡</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POPULAR DISHES ================= */}
      <section className="container py-5">
        <h3 className="section-title">🍲 Popular Right Now</h3>
        <div className="row g-4">
          {["Paneer", "Biryani", "Burger", "Coffee"].map((item, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="food-modern">
                <img
                  src={`https://source.unsplash.com/400x300/?${item}`}
                  alt={item}
                />
                <h6>{item}</h6>
                <small>⭐ 4.{i + 2} • 25 mins</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonial-modern text-center">
        <h3>💬 What Our Customers Say</h3>
        <p>"Fast delivery and amazing taste!"</p>
        <p>"Best food app in Hyderabad!"</p>
      </section>

      {/* ================= APP PROMO ================= */}
      <section className="app-promo-modern text-center">
        <h3>📱 Get the FoodCourt App</h3>
        <p>Live tracking • Exclusive offers • Faster checkout</p>
        <button>Google Play</button>
        <button>App Store</button>
      </section>

              <section className="container py-5 text-center">
          <h3 className="section-title">🏆 Top Restaurant Brands</h3>
          <div className="row g-4">
            {["Dominos", "KFC", "Pizza Hut", "Burger King"].map((brand, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="restaurant-modern">
                  <h5>{brand}</h5>
                  <p>⭐ 4.{i + 3} Rating</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
          <section className="py-5 text-center" style={{ background: "#fff3cd" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2>500+</h2>
            <p>Restaurants</p>
          </div>
          <div className="col-md-4">
            <h2>50K+</h2>
            <p>Happy Customers</p>
          </div>
          <div className="col-md-4">
            <h2>30 Min</h2>
            <p>Average Delivery</p>
          </div>
        </div>
      </div>
    </section>

          <section className="container py-5">
      <h3 className="section-title text-center">🛠 How It Works</h3>
      <div className="row text-center g-4">
        <div className="col-md-4">
          <h5>📍 Choose Location</h5>
          <p>Enter your address to find nearby restaurants</p>
        </div>
        <div className="col-md-4">
          <h5>🍽 Select Food</h5>
          <p>Browse menus and add your favorites to cart</p>
        </div>
        <div className="col-md-4">
          <h5>🚀 Fast Delivery</h5>
          <p>Get hot & fresh food delivered quickly</p>
        </div>
      </div>
    </section>
              
          <section className="py-5 text-center" style={{ background: "#e0f7fa" }}>
      <h3>📩 Get Exclusive Offers</h3>
      <p>Subscribe to our newsletter for discounts & updates</p>
      <input
        type="email"
        placeholder="Enter your email"
        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        style={{
          marginLeft: "10px",
          padding: "10px 15px",
          border: "none",
          borderRadius: "6px",
          background: "#0077b6",
          color: "white",
        }}
      >
        Subscribe
      </button>
    </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer-modern text-center">
        <p>📍 Hyderabad | 🕒 10 AM – 11 PM</p>
        <p>💳 UPI • Cards • COD • Wallets</p>
        <p>📞 Support | ℹ Help | 🔗 Social Links</p>
        <small>© {new Date().getFullYear()} FoodCourt</small>
      </footer>
    </div>
  );
}

export default Home;
