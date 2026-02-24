import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVeg } from "./vegSlice";
import { addToCart } from "../cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Veg.css";

// Debounce utility
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

function Veg() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: VegItems, loading } = useSelector((state) => state.veg);

  // Local state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // for quick view
  const [cartItemCount, setCartItemCount] = useState(0); // we'll get from Redux later

  // Get cart items count from Redux (assuming you have a cart state)
  const cartItems = useSelector((state) => state.cart.items || []);
  useEffect(() => {
    setCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vegWishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("vegWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch data
  useEffect(() => {
    dispatch(fetchVeg());
  }, [dispatch]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Extract unique categories from items
  const categories = useMemo(() => {
    if (!VegItems) return ["All"];
    const cats = VegItems.map((item) => item.category || "Other");
    return ["All", ...new Set(cats)];
  }, [VegItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!VegItems) return [];
    let items = [...VegItems];

    // Search filter
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
    }

    return items;
  }, [VegItems, debouncedSearch, selectedCategory, sortOrder]);

  // Handlers
  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart 🛒`);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
    const item = VegItems.find((i) => i._id === id);
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

  // If no items and not loading, show empty state
  const showEmpty = !loading && filteredItems.length === 0;

  return (
    <div className="veg-page">
      {/* ========== HERO SECTION ========== */}
      <section className="veg-hero">
        <div className="container h-100 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-lg-6 hero-content">
              <span className="hero-tag">🌱 100% Vegetarian</span>
              <h1 className="display-4 fw-bold">Fresh From The Garden</h1>
              <p className="lead">Handpicked veggies, cooked with love. Delivered hot.</p>
              <div className="hero-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search for Paneer, Burger, Biryani..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-6 hero-image">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Fresh vegetables"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="container py-5">
        {/* Filter Bar */}
        <div className="veg-filter-bar sticky-top">
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

        {/* Loading Skeletons */}
        {loading && (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <div className="veg-card skeleton">
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
        {showEmpty && (
          <div className="empty-state text-center py-5">
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
          </div>
        )}

        {/* Items Grid */}
        {!loading && !showEmpty && (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="col-md-3 col-sm-6">
                <div className="veg-card">
                  <div className="card-badge-group">
                    {item.bestseller && (
                      <span className="badge bestseller">🔥 Bestseller</span>
                    )}
                    {item.discount && (
                      <span className="badge discount">{item.discount}% OFF</span>
                    )}
                  </div>

                  <div className="img-wrapper">
                    <img
                      src={item.image}
                      className="card-img"
                      alt={item.name}
                      loading="lazy"
                      onClick={() => openQuickView(item)}
                    />
                    <button
                      className="wishlist-btn"
                      onClick={() => toggleWishlist(item._id)}
                    >
                      <i className={wishlist.includes(item._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                    </button>
                    <button
                      className="quick-view-btn"
                      onClick={() => openQuickView(item)}
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="card-body">
                    <h6 className="card-title" onClick={() => openQuickView(item)}>
                      {item.name}
                    </h6>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < Math.floor(item.rating || 4) ? "-fill" : ""}`}
                        ></i>
                      ))}
                      <span>({item.reviews || 120})</span>
                    </div>
                    <div className="price-section">
                      <span className="current-price">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="original-price">₹{item.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="btn-add"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                    >
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        className="floating-cart"
        onClick={() => navigate("/cart")}
      >
        <i className="bi bi-bag"></i>
        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
      </button>

      {/* Scroll to Top */}
      {showTop && (
        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      {/* Quick View Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    onClick={() => toggleWishlist(selectedItem._id)}
                  >
                    <i className={wishlist.includes(selectedItem._id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Veg;