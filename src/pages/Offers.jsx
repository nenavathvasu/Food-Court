// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { setDiscount } from "../features/cart/cartSlice";
import "../styles/pages.css";
import "../pages/Offers.css";

// Countdown to midnight
const useCountdown = () => {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const d = end - now;
      setT({ h: Math.floor(d / 3600000), m: Math.floor((d / 60000) % 60), s: Math.floor((d / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};
const pad = (n) => String(n).padStart(2, "0");

const COUPONS = [
  {
    code: "WELCOME10",
    discount: 10,
    title: "Welcome Offer",
    desc: "10% off on your first order",
    icon: "🎉",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.2)",
    tag: "New Users",
    minOrder: 0,
  },
  {
    code: "NEWYEAR20",
    discount: 20,
    title: "New Year Deal",
    desc: "20% off on all orders above ₹300",
    icon: "🎊",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.2)",
    tag: "Limited",
    minOrder: 300,
  },
  {
    code: "FESTIVE30",
    discount: 30,
    title: "Festive Special",
    desc: "30% off — our biggest discount ever!",
    icon: "🪔",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
    tag: "Hot Deal",
    minOrder: 500,
  },
  {
    code: "FIRST50",
    discount: 50,
    title: "First Order Bonanza",
    desc: "50% off on your very first order",
    icon: "🚀",
    color: "#ff4444",
    glow: "rgba(255,68,68,0.2)",
    tag: "First Order",
    minOrder: 0,
  },
  {
    code: "FREEDEL",
    discount: 0,
    title: "Free Delivery",
    desc: "Free delivery on all orders today",
    icon: "🛵",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.2)",
    tag: "Today Only",
    minOrder: 0,
    freeDelivery: true,
  },
  {
    code: "CASH100",
    discount: 15,
    title: "₹100 Cashback",
    desc: "15% off + cashback on orders above ₹400",
    icon: "💰",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.2)",
    tag: "Cashback",
    minOrder: 400,
  },
];

const FLASH_DEALS = [
  { name: "Chicken Biryani", originalPrice: 350, salePrice: 245, img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80", off: 30 },
  { name: "Paneer Butter Masala", originalPrice: 280, salePrice: 196, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80", off: 30 },
  { name: "Grilled Burger", originalPrice: 199, salePrice: 139, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80", off: 30 },
  { name: "Masala Dosa", originalPrice: 120, salePrice: 84, img: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80", off: 30 },
];

export default function Offers() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const timer     = useCountdown();
  const [copied,  setCopied]  = useState(null);
  const [applied, setApplied] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
    toast.success(`Code "${code}" copied to clipboard!`);
  };

  const handleApply = (coupon) => {
    if (coupon.freeDelivery) {
      toast.success(`Free delivery applied! 🛵`);
      setApplied(coupon.code);
      return;
    }
    dispatch(setDiscount(coupon.discount));
    setApplied(coupon.code);
    toast.success(`${coupon.discount}% discount applied to your cart! 🎉`);
    setTimeout(() => navigate("/cart"), 1200);
  };

  return (
    <div className="offers-page">

      {/* ── Hero ── */}
      <section className="offers-hero">
        <div className="offers-hero__bg" />
        <div className="container offers-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="offers-hero__eyebrow">🔥 Limited Time Deals</div>
            <h1 className="offers-hero__title">Exclusive Offers<br />Just For You</h1>
            <p className="offers-hero__sub">Copy a coupon code and apply it at checkout to save big</p>
            <div className="offers-hero__timer">
              <span className="offers-hero__timer-label">Deals reset in</span>
              <div className="offers-hero__timer-blocks">
                <div className="offers-timer-block"><span>{pad(timer.h)}</span><small>HRS</small></div>
                <div className="offers-timer-sep">:</div>
                <div className="offers-timer-block"><span>{pad(timer.m)}</span><small>MIN</small></div>
                <div className="offers-timer-sep">:</div>
                <div className="offers-timer-block"><span>{pad(timer.s)}</span><small>SEC</small></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Coupon Cards ── */}
      <section className="container offers-section">
        <h2 className="section-title">🎟️ Available Coupons</h2>
        <div className="offers-grid">
          {COUPONS.map((coupon, idx) => (
            <motion.div key={coupon.code} className="coupon-card"
              style={{ "--coupon-color": coupon.color, "--coupon-glow": coupon.glow }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -4 }}>

              {/* Left strip */}
              <div className="coupon-card__strip" />

              {/* Content */}
              <div className="coupon-card__body">
                <div className="coupon-card__top">
                  <div className="coupon-card__icon">{coupon.icon}</div>
                  <span className="coupon-card__tag">{coupon.tag}</span>
                </div>
                <h3 className="coupon-card__title">{coupon.title}</h3>
                <p className="coupon-card__desc">{coupon.desc}</p>
                {coupon.minOrder > 0 && (
                  <p className="coupon-card__min">Min order: ₹{coupon.minOrder}</p>
                )}

                {/* Code row */}
                <div className="coupon-card__code-row">
                  <div className="coupon-card__code">{coupon.code}</div>
                  <button className="coupon-card__copy" onClick={() => handleCopy(coupon.code)}>
                    <AnimatePresence mode="wait">
                      {copied === coupon.code ? (
                        <motion.span key="check"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <i className="bi bi-check2" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <i className="bi bi-copy" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Apply button */}
              <div className="coupon-card__footer">
                <button className="coupon-card__apply"
                  onClick={() => handleApply(coupon)}
                  disabled={applied === coupon.code}>
                  {applied === coupon.code ? (
                    <><i className="bi bi-check2-circle" /> Applied!</>
                  ) : (
                    <>Apply to Cart <i className="bi bi-arrow-right" /></>
                  )}
                </button>
              </div>

              {/* Dashed divider (notch effect) */}
              <div className="coupon-card__notch coupon-card__notch--left" />
              <div className="coupon-card__notch coupon-card__notch--right" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Flash Deals ── */}
      <section className="container offers-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>⚡ Flash Deals</h2>
          <div className="offers-flash-timer">
            Ends in <strong>{pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}</strong>
          </div>
        </div>
        <div className="offers-flash-grid">
          {FLASH_DEALS.map((item, idx) => (
            <motion.div key={item.name} className="flash-card"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate("/veg")}>
              <div className="flash-card__img-wrap">
                <img src={item.img} alt={item.name} loading="lazy" />
                <div className="flash-card__badge">-{item.off}%</div>
              </div>
              <div className="flash-card__body">
                <div className="flash-card__name">{item.name}</div>
                <div className="flash-card__prices">
                  <span className="flash-card__sale">₹{item.salePrice}</span>
                  <span className="flash-card__original">₹{item.originalPrice}</span>
                </div>
                <button className="flash-card__btn" onClick={(e) => { e.stopPropagation(); navigate("/veg"); }}>
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How to use ── */}
      <section className="container offers-section offers-howto">
        <h2 className="section-title" style={{ textAlign: "center" }}>How to Use a Coupon</h2>
        <div className="offers-howto__grid">
          {[
            { step: '1', icon: 'bi-tag', title: 'Pick a Coupon', desc: "Browse coupons above and click 'Apply to Cart'" },
            { step: "2", icon: "bi-bag-check", title: "Add Items",    desc: "Browse the menu and add your favourite dishes" },
            { step: "3", icon: "bi-credit-card", title: "Checkout",   desc: "Your discount is automatically applied at checkout" },
          ].map((s) => (
            <div key={s.step} className="offers-howto__card">
              <div className="offers-howto__num">{s.step}</div>
              <i className={`bi ${s.icon} offers-howto__icon`} />
              <h5>{s.title}</h5>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}