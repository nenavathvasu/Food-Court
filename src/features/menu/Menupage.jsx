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

// ── Pagination ────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

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
      <p className="pagination__info">Showing {start}–{end} of {totalItems} items</p>
      <div className="pagination">
        <button className="pagination__btn" onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1} title="Previous page">
          <i className="bi bi-chevron-left" />
        </button>
        {getPages().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="pagination__dots">…</span>
          ) : (
            <button key={page}
              className={`pagination__btn${currentPage === page ? " active" : ""}`}
              onClick={() => onPageChange(page)}>
              {page}
            </button>
          )
        )}
        <button className="pagination__btn" onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages} title="Next page">
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
  setPageAction, resetPageAction,
  wishlistKey, offerText,
}) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const timer     = useCountdown();

  const sliceState = useSelector((s) => s[stateKey]);
  const { data: items = [], loading, currentPage, itemsPerPage } = sliceState;

  // ✅ FIX: cart count reads from items array correctly
  const cartCount = useSelector((s) =>
    (s.cart.items || []).reduce((a, i) => a + (i.quantity || 0), 0)
  );

  const urlQuery = new URLSearchParams(location.search).get("q") || "";
  const [search,      setSearch]      = useState(urlQuery);
  const [debSearch,   setDebSearch]   = useState(urlQuery);
  const [sortOrder,   setSortOrder]   = useState("");
  const [selCategory, setSelCategory] = useState("All");
  const [showTop,     setShowTop]     = useState(false);
  const [quickItem,   setQuickItem]   = useState(null);
  const [showOffer,   setShowOffer]   = useState(true);

  const wishlistItems = useSelector((s) => s.wishlist.items);
  // ✅ FIX: wishlist tracking uses _id (MongoDB ObjectId string), falls back to numeric id
  const wishlist = useMemo(
    () => wishlistItems.map(i => i._id || String(i.id)),
    [wishlistItems]
  );

  // Sync URL search param
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setSearch(q);
    setDebSearch(q);
    if (q) dispatch(resetPageAction());
  }, [location.search]);

  useEffect(() => { dispatch(fetchAction()); }, [dispatch, fetchAction]);

  useEffect(() => { dispatch(resetPageAction()); }, [debSearch, selCategory, sortOrder]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // ✅ FIX: categories derived from actual backend `category` field
  // Backend defaults: Veg items → "Veg", NonVeg items → "Non-Veg"
  // Sub-categories come from whatever category string is stored in DB
  const categories = useMemo(() => {
    if (!items.length) return ["All"];
    const unique = [...new Set(items.map(i => i.category).filter(Boolean))];
    return ["All", ...unique];
  }, [items]);

  // ✅ FIX: popularity sort uses `reviews` count (backend has no `popularity` field)
  const filteredItems = useMemo(() => {
    let list = [...items];
    if (debSearch)
      list = list.filter(i => i.name?.toLowerCase().includes(debSearch.toLowerCase()));
    if (selCategory !== "All")
      list = list.filter(i => i.category === selCategory);
    if (sortOrder === "low")      list.sort((a, b) => a.price - b.price);
    if (sortOrder === "high")     list.sort((a, b) => b.price - a.price);
    if (sortOrder === "rating")   list.sort((a, b) => (b.rating  || 0) - (a.rating  || 0));
    if (sortOrder === "popular")  list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); // ✅ uses `reviews`
    return list;
  }, [items, debSearch, selCategory, sortOrder]);

  const { pageItems, totalPages, totalItems } = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage   = Math.min(currentPage, totalPages);
    const start      = (safePage - 1) * itemsPerPage;
    const pageItems  = filteredItems.slice(start, start + itemsPerPage);
    return { pageItems, totalPages, totalItems };
  }, [filteredItems, currentPage, itemsPerPage]);

  // ✅ FIX: "Chef's Top Picks" — sort by `bestseller` first, then by `rating`
  // Backend has `bestseller: Boolean` and `rating: Number`
  const recommended = useMemo(() =>
    [...items]
      .sort((a, b) => {
        if (b.bestseller !== a.bestseller) return b.bestseller ? 1 : -1;
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, 8),
    [items]
  );

  const handleAdd = useCallback((item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart 🛒`);
  }, [dispatch]);

  const toggleWishlist = useCallback((id) => {
    // ✅ FIX: match by _id (string) or numeric id — backend returns both
    const item = items.find(i => (i._id || String(i.id)) === id);
    if (item) {
      const isIn = wishlist.includes(id);
      dispatch(reduxToggleWishlist(item));
      toast.info(isIn ? `Removed from wishlist` : `${item.name} added ❤️`);
    }
  }, [items, wishlist, dispatch]);

  const handlePageChange = (page) => {
    dispatch(setPageAction(page));
    document.getElementById("menu-filter-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ FIX: item key always uses _id (MongoDB ObjectId) with numeric id as fallback
  const itemKey = (item) => item._id || String(item.id);

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

      {/* ── Chef's Top Picks slider ── */}
      {recommended.length > 0 && (
        <section className="menu-ai-section">
          <div className="container">
            <h5>
              <i className="bi bi-stars" /> Chef's Top Picks
              {/* ✅ Show bestseller badge hint */}
            </h5>
            <Slider {...sliderSettings}>
              {recommended.map(item => (
                <div key={itemKey(item)}>
                  <motion.div className="menu-ai-card" whileHover={{ scale: 1.04 }} onClick={() => setQuickItem(item)}>
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {/* ✅ Show bestseller ribbon if flagged in backend */}
                    {item.bestseller && (
                      <span style={{
                        position: "absolute", top: 6, left: 6,
                        background: "#ff6b35", color: "#fff",
                        fontSize: "0.6rem", fontWeight: 700,
                        padding: "2px 6px", borderRadius: 4,
                        textTransform: "uppercase", letterSpacing: 0.5,
                      }}>
                        Bestseller
                      </span>
                    )}
                    <small>{item.name}</small>
                    <span>
                      ₹{item.price}
                      {/* ✅ Show original price + discount if set in backend */}
                      {item.discount > 0 && (
                        <del style={{ fontSize: "0.75rem", color: "#999", marginLeft: 4 }}>
                          ₹{item.originalPrice}
                        </del>
                      )}
                    </span>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* ── Filter bar ── */}
      <div className="container">
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
              <option value="popular">Most Reviewed</option>{/* ✅ label matches what we actually sort by */}
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

        {/* ── Items grid ── */}
        {!loading && pageItems.length > 0 && (
          <>
            <motion.div className="menu-grid"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
              {pageItems.map(item => (
                <motion.div key={itemKey(item)}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard
                    item={item}
                    onAddToCart={handleAdd}
                    onWishlistToggle={toggleWishlist}
                    // ✅ FIX: consistent id comparison — both sides use same format
                    isWishlisted={wishlist.includes(item._id || String(item.id))}
                    onQuickView={setQuickItem}
                  />
                </motion.div>
              ))}
            </motion.div>

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
            isWishlisted={wishlist.includes(quickItem._id || String(quickItem.id))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}