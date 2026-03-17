// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/pages.css";

const useCountdown = () => {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const d = end - now;
      setT({ h: Math.floor(d / 3600000), m: Math.floor((d / 60000) % 60), s: Math.floor((d / 1000) % 60) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
};
const pad = n => String(n).padStart(2, "0");

const useCounter = (target, step, interval) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setVal(v => { if (v >= target) { clearInterval(id); return target; } return Math.min(v + step, target); }), interval);
    return () => clearInterval(id);
  }, [target, step, interval]);
  return val;
};

export default function Home() {
  const navigate = useNavigate();
  const timer    = useCountdown();
  const rest     = useCounter(500, 5, 40);
  const cust     = useCounter(50, 1, 40);
  const del      = useCounter(30, 1, 80);

  const CATEGORIES = [
    { name: "Veg",      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80", path: "/veg" },
    { name: "Non-Veg",  img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=200&q=80", path: "/nonveg" },
    { name: "Drinks",   img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=200&q=80", path: "/veg" },
    { name: "Desserts", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&q=80", path: "/veg" },
    { name: "Biryani",  img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=200&q=80", path: "/nonveg" },
  ];

  const OFFERS = [
    { title: "50% off first order", code: "FIRST50" },
    { title: "Free Delivery Today",  code: "FREEDEL" },
    { title: "₹100 Cashback",        code: "CASH100" },
  ];

  const RESTAURANTS = [
    { name: "Paradise Biryani", cuisine: "Hyderabadi", rating: 4.5, time: 35, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80" },
    { name: "Pizza Express",    cuisine: "Italian",    rating: 4.3, time: 25, img: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?auto=format&fit=crop&w=400&q=80" },
    { name: "Burger King",      cuisine: "American",   rating: 4.2, time: 20, img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=400&q=80" },
    { name: "Mehfil",           cuisine: "Mughlai",    rating: 4.6, time: 30, img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80" },
  ];

  const DISHES = [
    { name: "Paneer Butter Masala", price: 280, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80" },
    { name: "Chicken Biryani",      price: 350, img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80" },
    { name: "Grilled Burger",       price: 199, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
    { name: "Cold Coffee",          price: 120, img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80" },
  ];

  const TESTIMONIALS = [
    { text: "Fast delivery and amazing taste! The biryani was still hot.", author: "Rajesh, Hyderabad" },
    { text: "Best food app in the city! Great offers and hygienic packaging.", author: "Priya, Gachibowli" },
    { text: "Ordered at midnight and it arrived before time. Superb service!", author: "Arjun, Madhapur" },
  ];

  const STEPS = [
    { icon: "📍", title: "Choose Location", desc: "Enter your address to find nearby restaurants" },
    { icon: "🍽️", title: "Select Food",     desc: "Browse menus and add your favorites to cart" },
    { icon: "🚀", title: "Fast Delivery",   desc: "Get hot & fresh food delivered to your door" },
  ];

  const FEATURES = [
    { icon: "bi-lightning-charge", label: "30 Min Delivery" },
    { icon: "bi-shield-check",     label: "Hygiene Certified" },
    { icon: "bi-credit-card",      label: "Secure Payments" },
    { icon: "bi-gift",             label: "Daily Offers" },
    { icon: "bi-headset",          label: "24/7 Support" },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero__grid">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="home-hero__eyebrow">
                <i className="bi bi-star-fill" /> #1 Food Delivery in Hyderabad
              </div>
              <h1 className="home-hero__title">
                Craving Something?<br />
                We'll Bring It <span>Hot & Fresh</span>
              </h1>
              <p className="home-hero__subtitle">
                500+ restaurants • 30 min delivery • FSSAI certified kitchens
              </p>
              <div className="home-hero__search">
                <i className="bi bi-search" style={{ color: "var(--text-3)" }} />
                <input type="text" placeholder="Search dishes, restaurants…"
                  onKeyDown={(e) => e.key === "Enter" && navigate("/veg")} />
                <button className="btn btn-primary btn-pill" onClick={() => navigate("/veg")}>Find Food</button>
              </div>
            </motion.div>
            <div className="home-hero__image-wrap">
              <motion.img
                className="home-hero__image"
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
                alt="Delicious food"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              />
              <div className="home-hero__float-badge home-hero__float-badge--delivery">
                <span style={{ fontSize: "1.4rem" }}>🚀</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Super Fast</div>
                  <div style={{ color: "var(--text-2)", fontSize: "0.78rem" }}>~30 min delivery</div>
                </div>
              </div>
              <div className="home-hero__float-badge home-hero__float-badge--rating">
                <div style={{ fontSize: "1.4rem" }}>⭐</div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>4.8</div>
                <div style={{ color: "var(--text-2)", fontSize: "0.72rem" }}>50K+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-features">
        <div className="container">
          <div className="home-features__grid">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="home-features__item">
                <i className={`bi ${icon}`} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="home-categories">
        <div className="container">
          <h3 className="section-title">Explore Categories</h3>
          <div className="home-categories__scroll">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="home-category-card" onClick={() => navigate(cat.path)}>
                <img src={cat.img} alt={cat.name} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers ── */}
      <section className="home-offers">
        <div className="container">
          <h3 className="section-title">🔥 Today's Offers</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {OFFERS.map((offer) => (
              <div key={offer.code} className="home-offer-card">
                <h5 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 8 }}>{offer.title}</h5>
                <div className="home-offer-card__code">{offer.code}</div>
                <div style={{ marginTop: 10, fontSize: "0.82rem", color: "var(--text-2)" }}>
                  Ends in <span className="home-offer-card__timer">{pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}</span>
                </div>
                <button className="btn btn-primary btn-sm btn-pill" style={{ marginTop: 14 }}
                  onClick={() => navigate("/veg")}>Order Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Restaurants ── */}
      <section className="home-restaurants">
        <div className="container">
          <h3 className="section-title">⭐ Featured Restaurants</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {RESTAURANTS.map((r) => (
              <div key={r.name} className="home-restaurant-card">
                <img src={r.img} alt={r.name} />
                <div className="home-restaurant-card__body">
                  <div className="home-restaurant-card__name">{r.name}</div>
                  <div className="home-restaurant-card__cuisine">{r.cuisine}</div>
                  <div className="home-restaurant-card__meta">
                    <span className="home-restaurant-card__rating">⭐ {r.rating}</span>
                    <span className="home-restaurant-card__time"><i className="bi bi-clock" /> {r.time} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Dishes ── */}
      <section className="home-popular">
        <div className="container">
          <h3 className="section-title">🍲 Popular Right Now</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {DISHES.map((d) => (
              <div key={d.name} className="home-dish-card" onClick={() => navigate("/veg")}>
                <img src={d.img} alt={d.name} />
                <div className="home-dish-card__body">
                  <div className="home-dish-card__name">{d.name}</div>
                  <div className="home-dish-card__price">₹{d.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            <div className="home-stats__item">
              <div className="home-stats__num">{rest}+</div>
              <div className="home-stats__label">Restaurants</div>
            </div>
            <div className="home-stats__item">
              <div className="home-stats__num">{cust}K+</div>
              <div className="home-stats__label">Happy Customers</div>
            </div>
            <div className="home-stats__item">
              <div className="home-stats__num">{del} Min</div>
              <div className="home-stats__label">Average Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-howitworks">
        <div className="container">
          <h3 className="section-title" style={{ textAlign: "center" }}>🛠 How It Works</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.title} className="home-step-card">
                <div className="home-step-card__icon">{s.icon}</div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="home-testimonials">
        <div className="container">
          <h3 className="section-title" style={{ textAlign: "center" }}>💬 What Customers Say</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="home-testimonial-card">
                <p className="home-testimonial-card__quote">"{t.text}"</p>
                <div className="home-testimonial-card__author">— {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="home-newsletter">
        <div className="container">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem" }}>📩 Get Exclusive Offers</h3>
          <p style={{ color: "var(--text-2)", marginTop: 8 }}>Subscribe for discounts & daily deal alerts</p>
          <div className="home-newsletter__form">
            <input className="input" type="email" placeholder="Enter your email" />
            <button className="btn btn-primary btn-pill">Subscribe</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
            <div>
              <div className="home-footer__brand">🍔 FoodCourt</div>
              <p>Delivering happiness since 2026. Hot food, fast delivery.</p>
            </div>
            <div>
              <h6>Contact</h6>
              <p>📍 Hyderabad, India</p>
              <p>📞 +91 70756 70630</p>
              <p>🕒 10 AM – 11 PM</p>
            </div>
            <div>
              <h6>Payment</h6>
              <p>UPI • Cards • COD • Wallets</p>
            </div>
          </div>
          <hr className="home-footer__divider" />
          <p className="home-footer__copy">© {new Date().getFullYear()} FoodCourt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}