import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Veg.css";

import { fetchVeg } from "./vegSlice";
import { addToCart } from "../cart/cartSlice"; // ✅ Correct import

function Veg() {
  const dispatch = useDispatch();
  const { data: VegItems, loading } = useSelector((state) => state.veg);

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Theme state
  const [theme, setTheme] = useState("light");

  // Filter/Sort/Search state
  const [search, setSearch] = useState("");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  // Apply theme class to body
  const applyTheme = (themeName) => {
    document.body.classList.remove("light-theme", "dark-theme", "neon-theme");
    document.body.classList.add(`${themeName}-theme`);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    dispatch(fetchVeg());
  }, [dispatch]);

  if (loading) return <h2 className="text-center my-5">Loading Veg Menu...</h2>;

  // Filter items
  let filteredItems = VegItems || [];
  if (search.trim()) filteredItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterPrice === "low") filteredItems = filteredItems.filter(i => i.price < 150);
  if (filterPrice === "mid") filteredItems = filteredItems.filter(i => i.price >= 150 && i.price <= 250);
  if (filterPrice === "high") filteredItems = filteredItems.filter(i => i.price > 250);
  if (sortOrder === "low-high") filteredItems = filteredItems.sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") filteredItems = filteredItems.sort((a, b) => b.price - a.price);

  // Pagination
  const totalPages = Math.ceil((filteredItems.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart`);
  };

  // Assign colors based on category
  const getCardColor = (item) => {
    switch (item.category?.toLowerCase()) {
      case "veg": return "#d4edda";       // light green
      case "nonveg": return "#f8d7da";    // light red
      case "snacks": return "#fff3cd";    // light yellow
      case "drinks": return "#d1ecf1";    // light blue
      case "desserts": return "#f5d0f0";  // pink
      case "south indian": return "#ffe5b4"; // light orange
      default: return "#e2e3e5";          // gray
    }
  };

  // Assign description based on category
  const getDescription = (item) => {
    switch (item.category?.toLowerCase()) {
      case "veg": return "Healthy & fresh vegetables for your meal.";
      case "nonveg": return "Delicious meat dishes packed with protein.";
      case "snacks": return "Tasty snacks to satisfy your cravings.";
      case "drinks": return "Refreshing beverages to quench your thirst.";
      case "desserts": return "Sweet treats to complete your meal.";
      case "south indian": return "Authentic South Indian flavors.";
      default: return "Delicious food for you!";
    }
  };

  return (
    <div className="container my-5">

      {/* Top Text */}
      <div className="text-center mb-4">
        <h2 className="display-5 fw-bold text-success">🌿 Fresh & Delicious Veg Delights!</h2>
        <p className="lead text-muted">Healthy, tasty, and full of flavor – your perfect meal awaits!</p>
      </div>

      {/* Theme Switcher */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        <button className={`btn btn-sm ${theme === "light" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTheme("light")}>☀ Light</button>
        <button className={`btn btn-sm ${theme === "dark" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setTheme("dark")}>🌙 Dark</button>
        <button className={`btn btn-sm ${theme === "neon" ? "btn-warning" : "btn-outline-warning"}`} onClick={() => setTheme("neon")}>⚡ Neon</button>
      </div>

      {/* Search + Filter + Sort */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <input type="text" className="form-control w-50" placeholder="🔍 Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select w-auto" onChange={(e) => setFilterPrice(e.target.value)}>
          <option value="all">Price: All</option>
          <option value="low">Under ₹150</option>
          <option value="mid">₹150 - ₹250</option>
          <option value="high">Above ₹250</option>
        </select>
        <select className="form-select w-auto" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="row g-4">
        {currentItems.map((item) => (
          <div key={item.id} className="col-md-3 col-sm-6">
            <div
              className="card h-100 shadow-sm"
              style={{
                backgroundColor: getCardColor(item),
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <img src={item.image} className="card-img-top" alt={item.name} style={{ height: "180px", objectFit: "cover" }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text small">{getDescription(item)}</p>
                <p className="card-text fw-bold">₹{item.price}</p>
                <button className="btn btn-success mt-auto" onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-5 gap-2">
        <button className="btn btn-outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
        <button className="btn btn-outline-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-5">
        <h4 className="fw-bold text-success">✨ Taste the freshness in every bite!</h4>
        <p className="text-muted">Order your favorite dishes now and enjoy a healthy, flavorful experience!</p>
      </div>

      <style>{`
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.3); }
        body.light-theme { background-color: #f8f9fa; color: #212529; }
        body.dark-theme { background-color: #212529; color: #f8f9fa; }
        body.neon-theme { background-color: #000; color: #0ff; }
      `}</style>
    </div>
  );
}

export default Veg;