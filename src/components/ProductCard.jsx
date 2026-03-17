// src/components/ProductCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ item, onAddToCart, onWishlistToggle, isWishlisted, onQuickView }) {
  const id = item._id || item.id;

  return (
    <motion.div className="product-card"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}>
      {/* Badges */}
      <div className="product-card__badges">
        {item.bestseller && <span className="badge badge-primary">🔥 Best</span>}
        {item.spicy      && <span className="badge" style={{ background: "#ff9800", color: "#000" }}>🌶️ Spicy</span>}
        {item.discount   && <span className="badge badge-accent">{item.discount}% OFF</span>}
      </div>

      {/* Image */}
      <div className="product-card__img-wrap" onClick={() => onQuickView(item)}>
        <img className="product-card__img" src={item.image} alt={item.name} loading="lazy" />
        <button className="product-card__quick-view">Quick View</button>
        <button
          className={`product-card__wishlist${isWishlisted ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onWishlistToggle(id); }}>
          <i className={`bi bi-heart${isWishlisted ? "-fill" : ""}`} />
        </button>
      </div>

      {/* Body */}
      <div className="product-card__body">
        <div className="product-card__name" onClick={() => onQuickView(item)}>{item.name}</div>
        <div className="product-card__rating">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`bi bi-star${i < Math.floor(item.rating || 4) ? "-fill" : ""}`} />
          ))}
          <span>({item.reviews || 0})</span>
        </div>
        {item.description && (
          <p className="product-card__desc">{item.description}</p>
        )}
        <div className="product-card__footer">
          <div>
            <span className="product-card__price">₹{item.price}</span>
            {item.originalPrice && (
              <span className="product-card__original"> ₹{item.originalPrice}</span>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(item)}
            disabled={item.stock === 0}>
            {item.stock === 0 ? "Sold Out" : "+ Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}