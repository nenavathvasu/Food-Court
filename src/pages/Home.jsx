import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // ========== REAL-TIME COUNTDOWN FOR OFFERS ==========
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 59, 999); // end of today
    const diff = target - now;
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [stats, setStats] = useState({ restaurants: 0, customers: 0, delivery: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ========== ANIMATED STATISTICS COUNTER ==========
  useEffect(() => {
    const targetStats = { restaurants: 500, customers: 50, delivery: 30 };
    const increment = { restaurants: 5, customers: 1, delivery: 1 };
    const interval = setInterval(() => {
      setStats((prev) => {
        const newRest = Math.min(prev.restaurants + increment.restaurants, targetStats.restaurants);
        const newCust = Math.min(prev.customers + increment.customers, targetStats.customers);
        const newDel = Math.min(prev.delivery + increment.delivery, targetStats.delivery);
        if (newRest >= targetStats.restaurants && newCust >= targetStats.customers && newDel >= targetStats.delivery) {
          clearInterval(interval);
        }
        return {
          restaurants: newRest,
          customers: newCust,
          delivery: newDel,
        };
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-wrapper">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-modern">
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="hero-tag">#1 Food Delivery in Hyderabad</span>
            <h1>Craving Something?<br />We’ll Bring It Hot & Fresh 🍔</h1>
            <p>10,000+ restaurants • 50 min delivery • FSSAI certified</p>
            <div className="search-bar-modern">
              <div className="search-input-group">
                <span className="search-icon">📍</span>
                <input type="text" placeholder="Enter delivery location" />
              </div>
              <div className="search-input-group">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search for dishes or restaurants" />
              </div>
              <button onClick={() => navigate("/veg")}>Find Food</button>
            </div>
          </div>
          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Delicious food collage"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES STRIP ================= */}
      <section className="features-modern">
        <div className="container feature-flex">
          <div><span>🚀</span> 30 Min Delivery</div>
          <div><span>🛡️</span> Hygiene Certified</div>
          <div><span>💳</span> Secure Payments</div>
          <div><span>🎁</span> Daily Offers</div>
          <div><span>📞</span> 24/7 Support</div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="container py-5">
        <h3 className="section-title">Explore Categories</h3>
        <div className="category-scroll">
          {[
            { name: "Veg", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", path: "/veg" },
            { name: "Non-Veg", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", path: "/nonveg" },
            { name: "Drinks", img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", path: "/drinks" },
            { name: "Desserts", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", path: "/desserts" },
            { name: "Biryani", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", path: "/biryani" },
          ].map((cat, i) => (
            <div key={i} className="category-card" onClick={() => navigate(cat.path)}>
              <img src={cat.img} alt={cat.name} loading="lazy" />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TODAY'S OFFERS with REAL-TIME COUNTDOWN ================= */}
      <section className="container py-4">
        <h3 className="section-title">🔥 Today’s Offers</h3>
        <div className="row g-4">
          {[
            { title: "50% OFF on first order", code: "FIRST50" },
            { title: "Free Delivery", code: "FREEDEL" },
            { title: "₹100 Cashback", code: "CASH100" },
          ].map((offer, i) => (
            <div className="col-md-4" key={i}>
              <div className="offer-modern">
                <h5>{offer.title}</h5>
                <p>Use code: <strong>{offer.code}</strong></p>
                <p className="countdown">
                  ⏳ Ends in {String(timeLeft.hours).padStart(2, "0")}:
                  {String(timeLeft.minutes).padStart(2, "0")}:
                  {String(timeLeft.seconds).padStart(2, "0")}
                </p>
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
          {[
            { name: "Paradise Biryani", cuisine: "Hyderabadi", rating: 4.5, time: 35, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Pizza Express", cuisine: "Italian", rating: 4.3, time: 25, img: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Burger King", cuisine: "American", rating: 4.2, time: 20, img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Mehfil", cuisine: "Mughlai", rating: 4.6, time: 30, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
          ].map((r, i) => (
            <div className="col-md-3" key={i}>
              <div className="restaurant-modern">
                <img src={r.img} alt={r.name} loading="lazy" />
                <div className="restaurant-info">
                  <h6>{r.name}</h6>
                  <p>{r.cuisine}</p>
                  <span className="rating">⭐ {r.rating}</span>
                  <span className="delivery-time">{r.time} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POPULAR DISHES ================= */}
      <section className="container py-5">
        <h3 className="section-title">🍲 Popular Right Now</h3>
        <div className="row g-4">
          {[
            { name: "Paneer Butter Masala", price: 280, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Chicken Biryani", price: 350, img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Grilled Burger", price: 199, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
            { name: "Cold Coffee", price: 120, img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
          ].map((item, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="food-modern">
                <img src={item.img} alt={item.name} loading="lazy" />
                <h6>{item.name}</h6>
                <p className="price">₹{item.price}</p>
                <button className="add-btn">Add</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonial-modern">
        <div className="container">
          <h3>💬 What Our Customers Say</h3>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>"Fast delivery and amazing taste! The biryani was still hot."</p>
              <span>- Rajesh, Hyderabad</span>
            </div>
            <div className="testimonial-card">
              <p>"Best food app in Hyderabad! Great offers and hygienic packaging."</p>
              <span>- Priya, Gachibowli</span>
            </div>
            <div className="testimonial-card">
              <p>"Ordered at midnight and it arrived before time. Superb!"</p>
              <span>- Arjun, Madhapur</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS COUNTER ================= */}
      <section className="stats-modern py-5 text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>{stats.restaurants}+</h2>
              <p>Restaurants</p>
            </div>
            <div className="col-md-4">
              <h2>{stats.customers}K+</h2>
              <p>Happy Customers</p>
            </div>
            <div className="col-md-4">
              <h2>{stats.delivery} Min</h2>
              <p>Average Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= APP PROMO ================= */}
      <section className="app-promo-modern">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3>📱 Get the FoodCourt App</h3>
              <p>Live tracking • Exclusive offers • Faster checkout</p>
              <button className="app-store">App Store</button>
              <button className="google-play">Google Play</button>
            </div>
            <div className="col-md-6 text-center">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Mobile App" className="app-mockup" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TOP BRANDS ================= */}
      <section className="container py-5 text-center">
        <h3 className="section-title">🏆 Top Restaurant Brands</h3>
        <div className="row g-4">
          {["Dominos", "KFC", "Pizza Hut", "Burger King", "McDonald's", "Subway"].map((brand, i) => (
            <div className="col-6 col-md-2" key={i}>
              <div className="brand-modern">
                <h5>{brand}</h5>
                <p>⭐ 4.{i + 3} Rating</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="container py-5">
        <h3 className="section-title text-center">🛠 How It Works</h3>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="step-card">
              <span className="step-icon">📍</span>
              <h5>Choose Location</h5>
              <p>Enter your address to find nearby restaurants</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="step-card">
              <span className="step-icon">🍽️</span>
              <h5>Select Food</h5>
              <p>Browse menus and add your favorites to cart</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="step-card">
              <span className="step-icon">🚀</span>
              <h5>Fast Delivery</h5>
              <p>Get hot & fresh food delivered quickly</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="newsletter-modern py-5 text-center">
        <div className="container">
          <h3>📩 Get Exclusive Offers</h3>
          <p>Subscribe to our newsletter for discounts & updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer-modern">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>FoodCourt</h5>
              <p>Delivering happiness since 2020</p>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p>📍 Hyderabad, India</p>
              <p>📞 +91 98765 43210</p>
              <p>🕒 10 AM – 11 PM</p>
            </div>
            <div className="col-md-4">
              <h5>Payment</h5>
              <p>UPI • Cards • COD • Wallets</p>
              <div className="social-links">
                <a href="#">📘</a>
                <a href="#">🐦</a>
                <a href="#">📷</a>
              </div>
            </div>
          </div>
          <hr />
          <p className="text-center">© {new Date().getFullYear()} FoodCourt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;