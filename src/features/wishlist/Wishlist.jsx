// src/features/wishlist/Wishlist.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { removeFromWishlist, clearWishlist } from "./wishlistSlice";
import { addToCart } from "../cart/cartSlice";
import "../../styles/pages.css";
import "../../pages/Wishlist.css";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.wishlist);
  const [search, setSearch] = useState("");

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart 🛒`);
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlist(id));
    toast.info(`${name} removed from wishlist`);
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    toast.info("Wishlist cleared");
  };

  return (
    <div className="wishlist-page">
      <div className="container">

        {/* Header */}
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title">
              <i className="bi bi-heart-fill" style={{ color: "var(--primary)" }} /> My Wishlist
            </h1>
            <p className="wishlist-sub">
              {items.length} saved item{items.length !== 1 && "s"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {items.length > 0 && (
              <>
                <button className="btn btn-primary btn-sm btn-pill"
                  onClick={() => { items.forEach(i => dispatch(addToCart({ ...i, quantity: 1 }))); toast.success("All items added to cart! 🛒"); }}>
                  <i className="bi bi-bag-plus" /> Add All to Cart
                </button>
                <button className="btn btn-ghost btn-sm btn-pill"
                  style={{ color: "var(--primary)" }} onClick={handleClearAll}>
                  <i className="bi bi-trash" /> Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        {items.length > 0 && (
          <div className="wishlist-search">
            <i className="bi bi-search" />
            <input className="input" type="text"
              placeholder="Search your wishlist…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div className="wishlist-empty"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="wishlist-empty__icon">
              <i className="bi bi-heart" />
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Save your favourite dishes to order them later</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <button className="btn btn-primary btn-lg btn-pill" onClick={() => navigate("/veg")}>
                Browse Veg
              </button>
              <button className="btn btn-ghost btn-lg btn-pill" onClick={() => navigate("/nonveg")}>
                Browse Non-Veg
              </button>
            </div>
          </motion.div>
        )}

        {/* No search results */}
        {items.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-2)" }}>
            <i className="bi bi-search" style={{ fontSize: "2rem", display: "block", marginBottom: 12, opacity: 0.4 }} />
            <p>No items match your search</p>
            <button className="btn btn-ghost btn-sm btn-pill" style={{ marginTop: 12 }}
              onClick={() => setSearch("")}>Clear Search</button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <motion.div className="wishlist-grid"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
            <AnimatePresence>
              {filtered.map(item => {
                const id = item._id || item.id;
                return (
                  <motion.div key={id} className="wishlist-card"
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    layout>

                    {/* Image */}
                    <div className="wishlist-card__img-wrap">
                      <img src={item.image} alt={item.name} loading="lazy"
                        onClick={() => navigate(item.category === "Non-Veg" ? "/nonveg" : "/veg")} />
                      <button className="wishlist-card__remove"
                        onClick={() => handleRemove(id, item.name)} title="Remove from wishlist">
                        <i className="bi bi-heart-fill" />
                      </button>
                      {item.bestseller && (
                        <span className="wishlist-card__badge">🔥 Best</span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="wishlist-card__body">
                      <div className="wishlist-card__name">{item.name}</div>
                      {item.category && (
                        <div className="wishlist-card__cat">
                          <i className="bi bi-tag" /> {item.category}
                        </div>
                      )}
                      {item.rating && (
                        <div className="wishlist-card__rating">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi bi-star${i < Math.floor(item.rating) ? "-fill" : ""}`} />
                          ))}
                          <span>({item.reviews || 0})</span>
                        </div>
                      )}
                      {item.description && (
                        <p className="wishlist-card__desc">{item.description}</p>
                      )}
                      <div className="wishlist-card__footer">
                        <div>
                          <span className="wishlist-card__price">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="wishlist-card__original">₹{item.originalPrice}</span>
                          )}
                        </div>
                        <button className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}>
                          {item.stock === 0 ? "Sold Out" : <><i className="bi bi-bag-plus" /> Add</>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}