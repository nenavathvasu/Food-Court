import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Veg.css";

import { fetchVeg } from "./vegSlice";
import { addToCart } from "../cart/cartSlice";

function Veg() {
  const dispatch = useDispatch();
  const { data: VegItems, loading } = useSelector((state) => state.veg);

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlist, setWishlist] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);

  useEffect(() => {
    dispatch(fetchVeg());
  }, [dispatch]);

  if (loading) return <h2 className="text-center my-5">Loading Veg Menu...</h2>;

  let filteredItems = VegItems || [];

  // Search
  if (search.trim())
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

  // Category
  if (selectedCategory !== "all")
    filteredItems = filteredItems.filter(
      (item) => item.category?.toLowerCase() === selectedCategory
    );

  // Price filter
  if (filterPrice === "low") filteredItems = filteredItems.filter(i => i.price < 150);
  if (filterPrice === "mid") filteredItems = filteredItems.filter(i => i.price >= 150 && i.price <= 250);
  if (filterPrice === "high") filteredItems = filteredItems.filter(i => i.price > 250);

  // Sort
  if (sortOrder === "low-high") filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart 🛒`);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = ["all", "veg", "south indian", "snacks", "desserts", "drinks"];

  return (
    <div className="container my-5">

      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-success">🌿 Veg Specials</h2>
        <p className="text-muted">Fresh. Healthy. Delicious.</p>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="filter-bar shadow-sm p-3 mb-4 rounded bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select className="form-select" onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="low">Under ₹150</option>
              <option value="mid">₹150–₹250</option>
              <option value="high">Above ₹250</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" onChange={(e) => setSortOrder(e.target.value)}>
              <option value="none">Sort By</option>
              <option value="low-high">Price ↑</option>
              <option value="high-low">Price ↓</option>
            </select>
          </div>

          <div className="col-md-5 text-end small text-muted">
            Showing {filteredItems.length} dishes
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? "btn-success" : "btn-outline-success"}`}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FOOD GRID */}
      {currentItems.length === 0 ? (
        <div className="text-center py-5">
          <h5>No dishes found 😔</h5>
          <p>Try changing filters or search keyword</p>
        </div>
      ) : (
        <div className="row g-4">
          {currentItems.map((item) => (
            <div key={item.id} className="col-md-3 col-sm-6">
              <div className="card food-card h-100 shadow-sm">

                <div className="position-relative">
                  <img src={item.image} className="card-img-top food-img" alt={item.name} />

                  <span className="badge bg-success position-absolute top-0 start-0 m-2">
                    ⭐ {item.rating || 4.2}
                  </span>

                  <button
                    className="wishlist-btn"
                    onClick={() => toggleWishlist(item.id)}
                  >
                    {wishlist.includes(item.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{item.name}</h6>
                  <p className="text-muted small mb-2">Tasty & freshly prepared</p>
                  <h6 className="text-success">₹{item.price}</h6>

                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm w-50" onClick={() => setQuickViewItem(item)}>View</button>
                    <button className="btn btn-success btn-sm w-50" onClick={() => handleAddToCart(item)}>Add</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-center mt-5 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`btn ${currentPage === i + 1 ? "btn-success" : "btn-outline-success"}`} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewItem && (
        <div className="quickview-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="quickview-card" onClick={(e) => e.stopPropagation()}>
            <img src={quickViewItem.image} alt={quickViewItem.name} />
            <h4>{quickViewItem.name}</h4>
            <p>Delicious food made with fresh ingredients.</p>
            <h5 className="text-success">₹{quickViewItem.price}</h5>
            <button className="btn btn-success w-100" onClick={() => handleAddToCart(quickViewItem)}>Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Veg;
