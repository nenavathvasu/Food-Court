// src/features/menu/MenuPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Slider from "react-slick";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/pages.css";

import ProductCard    from "../../components/ProductCard";
import QuickViewModal from "../../components/QuickViewModal";
import { addToCart }  from "../cart/cartSlice";
import { toggleWishlist as reduxToggleWishlist } from "../wishlist/wishlistSlice";

// ── Countdown hook ────────────────────────────────────────────
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

// ── Pagination component ──────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page number array with ellipsis logic
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div>
      <p className="pagination__info">
        Showing {start}–{end} of {totalItems} items
      </p>
      <div className="pagination">
        {/* Prev */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <i className="bi bi-chevron-left" />
        </button>

        {/* Page numbers */}
        {getPages().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="pagination__dots">…</span>
          ) : (
            <button
              key={page}
              className={`pagination__btn${currentPage === page ? " active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}

// ── Slider settings ───────────────────────────────────────────
const sliderSettings = {
  dots: false, infinite: true, speed: 600, slidesToShow: 5,
  autoplay: true, autoplaySpeed: 2500,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 992,  settings: { slidesToShow: 3 } },
    { breakpoint: 768,  settings: { slidesToShow: 2 } },
    { breakpoint: 576,  settings: { slidesToShow: 1 } },
  ],
};

// ── Main component ────────────────────────────────────────────
export default function MenuPage({
  title, subtitle, tag, heroImage,
  fetchAction, stateKey,
  setPageAction, resetPageAction, paginationSelector,
  wishlistKey, offerText,
}) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const timer     = useCountdown();

  const sliceState           = useSelector((s) => s[stateKey]);
  const { data: items = [], loading, currentPage, itemsPerPage } = sliceState;
  const cartCount            = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));

  // Pre-fill search from URL query param e.g. /veg?q=biryani
  const urlQuery = new URLSearchParams(location.search).get("q") || "";
  const [search,      setSearch]      = useState(urlQuery);
  const [debSearch,   setDebSearch]   = useState(urlQuery);
  const [sortOrder,   setSortOrder]   = useState("");
  const [selCategory, setSelCategory] = useState("All");
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const wishlist = wishlistItems.map(i => i._id || i.id);
  const [showTop,    setShowTop]    = useState(false);
  const [quickItem,  setQuickItem]  = useState(null);
  const [showOffer,  setShowOffer]  = useState(true);

  // Sync search term when URL ?q= param changes
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setSearch(q);
    setDebSearch(q);
    if (q) dispatch(resetPageAction());
  }, [location.search]);

  // Fetch on mount
  useEffect(() => { dispatch(fetchAction()); }, [dispatch, fetchAction]);

  // Reset to page 1 whenever filters change
  useEffect(() => { dispatch(resetPageAction()); }, [debSearch, selCategory, sortOrder]);

  // Scroll top button
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Persist wishlist
  // wishlist is persisted by wishlistSlice automatically

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // Categories
  const categories = useMemo(() => {
    if (!items.length) return ["All"];
    return ["All", ...new Set(items.map(i => i.category || "Other"))];
  }, [items]);

  // Filter + sort (full list, before pagination)
  const filteredItems = useMemo(() => {
    let list = [...items];
    if (debSearch)             list = list.filter(i => i.name.toLowerCase().includes(debSearch.toLowerCase()));
    if (selCategory !== "All") list = list.filter(i => i.category === selCategory);
    if (sortOrder === "low")      list.sort((a, b) => a.price - b.price);
    if (sortOrder === "high")     list.sort((a, b) => b.price - a.price);
    if (sortOrder === "rating")   list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortOrder === "popular")  list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return list;
  }, [items, debSearch, selCategory, sortOrder]);

  // Pagination — slice filteredItems into the current page
  const { pageItems, totalPages, totalItems } = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage   = Math.min(currentPage, totalPages);
    const start      = (safePage - 1) * itemsPerPage;
    const pageItems  = filteredItems.slice(start, start + itemsPerPage);
    return { pageItems, totalPages, totalItems };
  }, [filteredItems, currentPage, itemsPerPage]);

  // AI recommendations (top 8 by price)
  const recommended = useMemo(() =>
    [...items].sort((a, b) => b.price - a.price).slice(0, 8), [items]);

  // Handlers
  const handleAdd = useCallback((item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart 🛒`);
  }, [dispatch]);

  const toggleWishlist = useCallback((id) => {
    const item = items.find(i => (i._id || i.id) === id);
    if (item) {
      const isIn = wishlist.includes(id);
      dispatch(reduxToggleWishlist(item));
      toast.info(isIn ? `Removed from wishlist` : `${item.name} added ❤️`);
    }
  }, [items, wishlist, dispatch]);

  const handlePageChange = (page) => {
    dispatch(setPageAction(page));
    // Smooth scroll back to the filter bar
    document.getElementById("menu-filter-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Offer banner ── */}
      <AnimatePresence>
        {showOffer && (
          <motion.div className="menu-offer-banner"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <span>🔥</span>
            <span>
              {offerText} – Ends in{" "}
              <strong className="menu-offer-timer">{pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}</strong>
            </span>
            <button onClick={() => setShowOffer(false)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 8, fontSize: "1.2rem" }}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="menu-hero">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div className="menu-hero__content">
              <div className="menu-hero__tag">{tag}</div>
              <h1 className="menu-hero__title">{title}</h1>
              <p className="menu-hero__sub">{subtitle}</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-primary btn-lg btn-pill" onClick={() => navigate("/cart")}>
                  <i className="bi bi-bag" /> Order Now
                </button>
              </div>
            </div>
            <div>
              <img src={heroImage} alt={title} className="menu-hero__image" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Picks slider ── */}
      {recommended.length > 0 && (
        <section className="menu-ai-section">
          <div className="container">
            <h5><i className="bi bi-stars" /> Chef's Top Picks</h5>
            <Slider {...sliderSettings}>
              {recommended.map(item => (
                <div key={item._id || item.id}>
                  <motion.div className="menu-ai-card" whileHover={{ scale: 1.04 }} onClick={() => setQuickItem(item)}>
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <small>{item.name}</small>
                    <span>₹{item.price}</span>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* ── Filter bar ── */}
      <div className="container">
        {/* Anchor for scroll-to on page change */}
        <div id="menu-filter-anchor" style={{ scrollMarginTop: "80px" }} />

        <div className="menu-filter-bar">
          <div className="menu-filter-bar__row">
            <div className="menu-filter-bar__search">
              <i className="bi bi-search" />
              <input className="input" type="text" placeholder="Search dishes…"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button className="clear-btn" onClick={() => setSearch("")}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
            <select className="input menu-filter-bar__select"
              value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Sort By</option>
              <option value="low">Price ↑</option>
              <option value="high">Price ↓</option>
              <option value="rating">Rating</option>
              <option value="popular">Popularity</option>
            </select>
            <div className="menu-filter-bar__chips">
              {categories.map(cat => (
                <button key={cat}
                  className={`chip${selCategory === cat ? " active" : ""}`}
                  onClick={() => setSelCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="menu-filter-bar__count">
            {totalItems} item{totalItems !== 1 && "s"} found
            {totalPages > 1 && (
              <span style={{ marginLeft: 8, color: "var(--text-3)" }}>
                · Page {Math.min(currentPage, totalPages)} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* ── Skeletons ── */}
        {loading && (
          <div className="menu-grid" style={{ marginBottom: 40 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div className="skeleton" style={{ height: 180 }} />
                <div style={{ padding: 14, background: "var(--bg-3)" }}>
                  <div className="skeleton" style={{ height: 16, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 12 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filteredItems.length === 0 && (
          <div className="menu-empty">
            <img src="https://cdn-icons-png.flaticon.com/512/3076/3076097.png" alt="empty" width="100" />
            <h4>No dishes found</h4>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-ghost btn-pill" style={{ marginTop: 16 }}
              onClick={() => { setSearch(""); setSelCategory("All"); setSortOrder(""); }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Items grid (current page only) ── */}
        {!loading && pageItems.length > 0 && (
          <>
            <motion.div className="menu-grid"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
              {pageItems.map(item => (
                <motion.div key={item._id || item.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard
                    item={item}
                    onAddToCart={handleAdd}
                    onWishlistToggle={toggleWishlist}
                    isWishlisted={wishlist.includes(item._id || item.id)}
                    onQuickView={setQuickItem}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* ── Pagination ── */}
            <Pagination
              currentPage={Math.min(currentPage, totalPages)}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* ── Floating cart ── */}
      <motion.button className="floating-cart-btn" onClick={() => navigate("/cart")}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <i className="bi bi-bag" />
        {cartCount > 0 && <span className="count">{cartCount}</span>}
      </motion.button>

      {/* ── Scroll to top ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button className="scroll-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <i className="bi bi-arrow-up" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Quick view modal ── */}
      <AnimatePresence>
        {quickItem && (
          <QuickViewModal
            item={quickItem}
            onClose={() => setQuickItem(null)}
            onAddToCart={handleAdd}
            onWishlistToggle={toggleWishlist}
            isWishlisted={wishlist.includes(quickItem._id || quickItem.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}