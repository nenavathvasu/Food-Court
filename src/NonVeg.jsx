// Nonveg.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "./cartSlice";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Nonveg.css";
import { fetchNonveg } from "./nonvegSlice";

function Nonveg() {
  const dispatch = useDispatch();
  const { data: NonvegItems, loading } = useSelector((state) => state.nonveg);

  const [search, setSearch] = useState("");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [theme, setTheme] = useState("light");

  const applyTheme = (themeName) => {
    document.body.classList.remove("light-theme", "dark-theme", "neon-theme");
    document.body.classList.add(`${themeName}-theme`);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchNonveg());
  }, [dispatch]);

  if (loading) return <h2 className="text-center my-5">Loading Non-Veg Menu...</h2>;

  const detectCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes("chicken")) return "Chicken";
    if (n.includes("mutton")) return "Mutton";
    if (n.includes("fish")) return "Fish";
    if (n.includes("prawn") || n.includes("crab") || n.includes("seafood")) return "Seafood";
    return "General";
  };

  let filtered = NonvegItems?.map((item) => ({
    ...item,
    category: detectCategory(item.name),
  }));

  if (search.trim()) filtered = filtered.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  if (category !== "All") filtered = filtered.filter((i) => i.category === category);

  if (filterPrice === "low") filtered = filtered.filter((i) => i.price < 200);
  if (filterPrice === "mid") filtered = filtered.filter((i) => i.price >= 200 && i.price <= 400);
  if (filterPrice === "high") filtered = filtered.filter((i) => i.price > 400);

  if (sortOrder === "low-high") filtered = filtered.sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") filtered = filtered.sort((a, b) => b.price - a.price);

  const randomRating = () => (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart`);
  };

  const cardColors = {
    light: ["#ffecec", "#ffe9e4", "#fff0e6", "#ffe6f2", "#fff2e6", "#ffe6e6"],
    dark: ["#2a2a2a", "#1f1f1f", "#262626", "#2c2c2c", "#1e1e1e", "#292929"],
    neon: ["#ff0066", "#ff6600", "#cc00ff", "#00e6e6", "#39ff14", "#ff0080"],
  };

  return (
    <div className="container my-5">

      {/* ---------- TOP HEADER ---------- */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-danger">🍗 Non-Veg Special Menu</h1>
        <p className="text-muted fs-5">Delicious, spicy & freshly prepared for you!</p>
        <hr className="w-50 mx-auto" />
      </div>

      {/* Theme Switcher */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        <button className={`btn btn-sm ${theme === "light" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setTheme("light")}>☀ Light</button>
        <button className={`btn btn-sm ${theme === "dark" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setTheme("dark")}>🌙 Dark</button>
        <button className={`btn btn-sm ${theme === "neon" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setTheme("neon")}>⚡ Neon</button>
      </div>

      {/* Search + Filter */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Search non-veg dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-select w-auto" onChange={(e) => setFilterPrice(e.target.value)}>
          <option value="all">Price: All</option>
          <option value="low">Under ₹200</option>
          <option value="mid">₹200 - ₹400</option>
          <option value="high">Above ₹400</option>
        </select>
        <select className="form-select w-auto" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>
      </div>

      {/* Category Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4 gap-2">
        {["All", "Chicken", "Mutton", "Fish", "Seafood", "General"].map((cat) => (
          <li key={cat} className="nav-item">
            <button
              className={`nav-link ${category === cat ? "active bg-danger" : "bg-light text-dark"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Items Grid */}
      <div className="row g-4">
        {currentItems.map((item, index) => {
          const rating = randomRating();
          const isTopRated = rating > 4.5;
          const isNew = Math.random() > 0.75;

          return (
            <div key={item.id} className="col-md-3 col-sm-6">
              <div
                className="card h-100 shadow position-relative theme-card"
                style={{
                  backgroundColor: cardColors[theme][index % cardColors[theme].length],
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <div className="position-absolute m-2" style={{ zIndex: 10 }}>
                  <span className="badge bg-danger me-1">🍗 Non-Veg</span>
                  {isTopRated && <span className="badge bg-warning text-dark me-1">⭐ Top Rated</span>}
                  {isNew && <span className="badge bg-primary">🆕 New</span>}
                </div>

                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="text-warning fw-bold">⭐ {rating} <span className="text-muted">/ 5</span></p>
                  <p className="text-muted" style={{ flexGrow: 1 }}>{item.description}</p>
                  <p className="fw-bold fs-5">₹{item.price}</p>

                  <button
                    className="btn nonveg-animated-btn mt-auto"
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
        <button
          className="btn btn-outline-danger"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ⬅ Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-danger"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ➡
        </button>
      </div>

      <p className="text-center mt-4 text-muted">
        Showing <b>{currentItems.length}</b> of <b>{filtered.length}</b> items.
      </p>

      {/* ---------- FOOTER SECTION ---------- */}
      <div className="mt-5 p-4 text-center bg-light rounded shadow-sm">
        <h5 className="fw-bold text-danger">❤️ Thank You for Visiting!</h5>
        <p className="text-muted mb-1">Explore more dishes and enjoy a flavorful experience.</p>
        <p className="small text-secondary">📍 Hyderabad | 🍽 Open 10 AM - 11 PM | ☎ 9876543210</p>
      </div>

    </div>
  );
}

export default Nonveg;
