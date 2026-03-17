// src/features/cart/Cart.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  incrementQuantity, decrementQuantity, removeFromCart,
  clearCart, setDiscount, selectCartTotals,
} from "./cartSlice";
import "../../styles/pages.css";

const COUPONS = { WELCOME10: 10, NEWYEAR20: 20, FESTIVE30: 30 };

export default function Cart() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { items, discountPercentage, loading } = useSelector((s) => s.cart);
  const totals = useSelector(selectCartTotals);

  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = () => {
    const disc = COUPONS[coupon.toUpperCase()];
    if (!disc) {
      Swal.fire({ icon: "error", title: "Invalid Coupon", text: "Enter a valid code", background: "#1a1a1a", color: "#f0f0f0" });
      return;
    }
    dispatch(setDiscount(disc));
    Swal.fire({ icon: "success", title: `${disc}% Off Applied!`, timer: 1400, showConfirmButton: false, background: "#1a1a1a", color: "#f0f0f0" });
    setCoupon("");
  };

  const handlePlaceOrder = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.email) {
      Swal.fire({ icon: "warning", title: "Login Required", text: "Please login to place an order", background: "#1a1a1a", color: "#f0f0f0" })
        .then(() => navigate("/login"));
      return;
    }
    // Navigate to payment page — payment page handles order creation
    navigate("/payment");
  };

  if (!items.length) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
            <p style={{ color: "var(--text-2)", marginBottom: 24 }}>Add delicious items to get started!</p>
            <button className="btn btn-primary btn-lg btn-pill" onClick={() => navigate("/veg")}>Browse Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h2 className="cart-page__title">Your Cart 🛒</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

          {/* Items */}
          <div>
            <AnimatePresence>
              {items.map(item => {
                const id = item._id || item.id;
                return (
                  <motion.div key={id} className="cart-item-card"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div style={{ flex: 1 }}>
                      <div className="cart-item-card__name">{item.name}</div>
                      <div className="cart-item-card__price">₹{item.price} per item</div>
                      <div className="qty-ctrl">
                        <button onClick={() => dispatch(decrementQuantity(id))}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => dispatch(incrementQuantity(id))}>+</button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--accent)" }}>
                        ₹{item.price * item.quantity}
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ marginTop: 10, color: "var(--primary)" }}
                        onClick={() => dispatch(removeFromCart(id))}>
                        <i className="bi bi-trash" /> Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--primary)", marginTop: 8 }}
              onClick={() => dispatch(clearCart())}>
              <i className="bi bi-x-circle" /> Clear Cart
            </button>
          </div>

          {/* Bill */}
          <div className="bill-card">
            <h4>Bill Summary</h4>

            {/* Coupons */}
            <div className="coupon-section">
              <div style={{ marginBottom: 8 }}>
                {Object.entries(COUPONS).map(([code, val]) => (
                  <div key={code} className="coupon-item" onClick={() => setCoupon(code)}>
                    <code>{code}</code> — {val}% off
                  </div>
                ))}
              </div>
              <div className="coupon-input-wrap">
                <input className="input input-sm" placeholder="Enter coupon code"
                  value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button className="btn btn-accent btn-sm" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {discountPercentage > 0 && (
                <p style={{ color: "var(--green)", fontSize: "0.82rem", marginTop: 8 }}>
                  ✓ {discountPercentage}% discount applied
                </p>
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div className="bill-row"><span>Subtotal</span><span>₹{totals.subtotal}</span></div>
              {totals.discountAmount > 0 && (
                <div className="bill-row discount"><span>Discount ({discountPercentage}%)</span><span>−₹{totals.discountAmount}</span></div>
              )}
              <div className="bill-row"><span>GST (5%)</span><span>₹{totals.gst}</span></div>
              <div className="bill-row"><span>Delivery</span><span>₹{totals.delivery}</span></div>
              <div className="bill-row"><span>Handling</span><span>₹{totals.handling}</span></div>
              {totals.smallCart > 0 && (
                <div className="bill-row"><span>Small Cart Fee</span><span>₹{totals.smallCart}</span></div>
              )}
              <div className="bill-row total"><span>Total</span><span>₹{totals.total}</span></div>
            </div>

            <button className="btn btn-primary btn-block" style={{ marginTop: 20 }}
              onClick={handlePlaceOrder} >
              "Proceed to Payment →"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}