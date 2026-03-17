// src/components/QuickViewModal.jsx
import React from "react";
import { motion } from "framer-motion";

export default function QuickViewModal({ item, onClose, onAddToCart, onWishlistToggle, isWishlisted }) {
  if (!item) return null;
  const id = item._id || item.id;

  return (
    <motion.div className="modal-overlay" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-box" onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
        <button className="modal-box__close" onClick={onClose}>
          <i className="bi bi-x" />
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <img src={item.image} alt={item.name} className="modal-box__img" />
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {item.bestseller && <span className="badge badge-primary">🔥 Bestseller</span>}
              {item.discount   && <span className="badge badge-accent">{item.discount}% OFF</span>}
            </div>
            <div className="modal-box__name">{item.name}</div>
            <div style={{ color: "var(--accent)", display: "flex", gap: 3, marginBottom: 10 }}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`bi bi-star${i < Math.floor(item.rating || 4) ? "-fill" : ""}`} />
              ))}
              <span style={{ color: "var(--text-3)", fontSize: "0.82rem", marginLeft: 6 }}>
                {item.reviews || 0} reviews
              </span>
            </div>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>
              {item.description || "Freshly prepared with the finest ingredients. Served hot."}
            </p>
            <div style={{ marginBottom: 20 }}>
              <span className="modal-box__price">₹{item.price}</span>
              {item.originalPrice && (
                <span className="modal-box__original">₹{item.originalPrice}</span>
              )}
            </div>
            <div className="modal-box__actions">
              <button className="btn btn-primary" style={{ flex: 1 }}
                onClick={() => { onAddToCart(item); onClose(); }}
                disabled={item.stock === 0}>
                {item.stock === 0 ? "Sold Out" : "Add to Cart"}
              </button>
              <button className="btn btn-ghost"
                onClick={() => onWishlistToggle(id)}>
                <i className={`bi bi-heart${isWishlisted ? "-fill" : ""}`}
                  style={{ color: isWishlisted ? "var(--primary)" : undefined }} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}