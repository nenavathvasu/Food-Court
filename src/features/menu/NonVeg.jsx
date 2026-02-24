import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";   // <-- add this
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Nonveg.css";

import { fetchNonveg } from "./nonvegSlice";
import { addToCart } from "../cart/cartSlice";

// Bootstrap Icons (optional but recommended)
// import "bootstrap-icons/font/bootstrap-icons.css";

function Nonveg() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // if you have useNavigate
  const { data: NonvegItems, loading } = useSelector((state) => state.nonveg);

  // Local state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showOfferBanner, setShowOfferBanner] = useState(true);

  // Get cart items count from Redux (adjust path to match your store)
  const cartItems = useSelector((state) => state.cart.items || []);
  useEffect(() => {
    setCartItemCount(cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0));
  }, [cartItems]);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nonvegWishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("nonvegWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch data
  useEffect(() => {
    dispatch(fetchNonveg());
  }, [dispatch]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Extract unique categories from items (assuming each item has a 'category' field)
  const categories = useMemo(() => {
    if (!NonvegItems) return ["All"];
    const cats = NonvegItems.map((item) => item.category || "Other");
    return ["All", ...new Set(cats)];
  }, [NonvegItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!NonvegItems) return [];
    let items = [...NonvegItems];

    // Search
    if (debouncedSearch) {
      items = items.filter((i) =>
        i.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }

    // Sorting
    if (sortOrder === "low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOrder === "popularity") {
      items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return items;
  }, [NonvegItems, debouncedSearch, selectedCategory, sortOrder]);

  // AI Recommendations (based on highest price or you can use a better algorithm)
  const recommendedItems = useMemo(() => {
    if (!NonvegItems) return [];
    return [...NonvegItems].sort((a, b) => b.price - a.price).slice(0, 8);
  }, [NonvegItems]);

  // Handlers
  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart 🛒`);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
    const item = NonvegItems?.find((i) => i.id === id);
    if (item) {
      toast.info(
        wishlist.includes(id)
          ? `${item.name} removed from wishlist`
          : `${item.name} added to wishlist ❤️`
      );
    }
  };

  const openQuickView = (item) => setSelectedItem(item);
  const closeQuickView = () => setSelectedItem(null);

  // Carousel settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  // Countdown timer (ends at midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight - now;
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="nonveg-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ========== OFFER BANNER ========== */}
      <AnimatePresence>
        {showOfferBanner && (
          <motion.div
            className="offer-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="container">
              <div className="offer-content">
                <span className="offer-emoji">🔥</span>
                <span className="offer-text">
                  Flash Sale! 30% off on all grills. Ends in{" "}
                  <span className="timer">
                    {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </span>
                <button className="offer-close" onClick={() => setShowOfferBanner(false)}>
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== HERO SECTION ========== */}
      <section className="nonveg-hero">
        <div className="container h-100 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-lg-6 hero-content">
              <motion.span
                className="hero-tag"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🍗 Smoky & Spicy
              </motion.span>
              <motion.h1
                className="display-4 fw-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Flame‑Grilled Perfection
              </motion.h1>
              <motion.p
                className="lead"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Juicy kebabs, sizzling wings, and rich curries – crafted by master chefs.
              </motion.p>
              <motion.div
                className="hero-search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search for Chicken, Mutton, Fish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </motion.div>
            </div>
            <div className="col-lg-6 hero-image">
              <motion.img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Grilled chicken"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== AI RECOMMENDATIONS ========== */}
      {recommendedItems.length > 0 && (
        <section className="ai-section container py-5">
          <h5 className="ai-heading mb-4">
            <i className="bi bi-stars"></i> Chef’s Premium Picks
          </h5>
          <Slider {...sliderSettings}>
            {recommendedItems.map((item) => (
              <div key={item.id} className="px-2">
                <motion.div
                  className="ai-circle-card"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => openQuickView(item)}
                >
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <small>{item.name}</small>
                  <span>₹{item.price}</span>
                </motion.div>
              </div>
            ))}
          </Slider>
        </section>
      )}

      {/* ========== FILTER BAR ========== */}
      <div className="container">
        <div className="filter-bar sticky-top">
          <div className="row g-3 align-items-center">
            <div className="col-lg-4">
              <div className="search-wrapper">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-search" onClick={() => setSearch("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="col-lg-3">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
            <div className="col-lg-5">
              <div className="category-chips">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`chip ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="result-count">
            {filteredItems.length} item{filteredItems.length !== 1 && "s"} found
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="container py-4">
        {/* Loading Skeletons */}
        {loading && (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-lg-3 col-md-4 col-sm-6">
                <div className="dark-card skeleton">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-body">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            className="empty-state text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3076/3076097.png"
              alt="No items"
              width="120"
            />
            <h4 className="mt-4">No dishes found</h4>
            <p>Try adjusting your search or filter</p>
            <button
              className="btn btn-outline-light"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortOrder("");
              }}
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
                <motion.div
                  className="dark-card"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="card-badge-group">
                    {item.bestseller && (
                      <span className="badge bestseller">🔥 Bestseller</span>
                    )}
                    {item.spicy && <span className="badge spicy">🌶️ Spicy</span>}
                    {item.discount && (
                      <span className="badge discount">{item.discount}% OFF</span>
                    )}
                  </div>

                  <div className="img-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onClick={() => openQuickView(item)}
                    />
                    <button
                      className="wishlist-btn"
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <i className={wishlist.includes(item.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                    </button>
                    <button
                      className="quick-view-btn"
                      onClick={() => openQuickView(item)}
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="card-content">
                    <h6 onClick={() => openQuickView(item)}>{item.name}</h6>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < Math.floor(item.rating || 4) ? "-fill" : ""}`}
                        ></i>
                      ))}
                      <span>({item.reviews || 120})</span>
                    </div>
                    <p className="description">{item.description || "Succulent & flavorful"}</p>
                    <div className="price-row">
                      <div>
                        <span className="current-price">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="original-price">₹{item.originalPrice}</span>
                        )}
                      </div>
                      <button
                        className="add-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? "Sold Out" : "Add"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <motion.button
        className="floating-cart"
        onClick={() => navigate("/cart")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <i className="bi bi-bag"></i>
        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
      </motion.button>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <i className="bi bi-arrow-up"></i>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="modal-overlay"
            onClick={closeQuickView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button className="modal-close" onClick={closeQuickView}>
                <i className="bi bi-x"></i>
              </button>
              <div className="row">
                <div className="col-md-6">
                  <img src={selectedItem.image} alt={selectedItem.name} className="modal-img" />
                </div>
                <div className="col-md-6">
                  <h2>{selectedItem.name}</h2>
                  <div className="modal-rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi bi-star${i < Math.floor(selectedItem.rating || 4) ? "-fill" : ""}`}
                      ></i>
                    ))}
                    <span>{selectedItem.reviews || 120} reviews</span>
                  </div>
                  <p className="modal-description">
                    {selectedItem.description || "Freshly prepared with finest ingredients. Served hot and crispy."}
                  </p>
                  <div className="modal-price">
                    <span className="modal-current">₹{selectedItem.price}</span>
                    {selectedItem.originalPrice && (
                      <span className="modal-original">₹{selectedItem.originalPrice}</span>
                    )}
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-add"
                      onClick={() => {
                        handleAddToCart(selectedItem);
                        closeQuickView();
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn-wishlist"
                      onClick={() => toggleWishlist(selectedItem.id)}
                    >
                      <i className={wishlist.includes(selectedItem.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Nonveg;