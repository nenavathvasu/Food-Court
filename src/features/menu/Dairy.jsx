import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDairy } from "./DairySlice";
import { addToCart } from "../cart/cartSlice";
import { toast } from "react-toastify";
import "./Dairy.css";

function Dairy() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dairy);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchDairy());
  }, [dispatch]);

  if (loading) return <h2 className="text-center text-light my-5">Loading Dairy...</h2>;

  let filtered = data;

  if (search.trim()) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortOrder === "low-high") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart 🛒`);
  };

  return (
    <div className="dairy-page container py-5">

      <h2 className="text-center text-info mb-4">🥛 Dairy, Bread & Eggs</h2>

      <div className="d-flex justify-content-between mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search dairy items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-select w-25" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="low-high">Price ↑</option>
          <option value="high-low">Price ↓</option>
        </select>
      </div>

      <div className="row g-4">
        {currentItems.map(item => (
          <div key={item._id} className="col-md-3 col-sm-6">
            <div className="card dairy-card h-100">
              <img src={item.image} alt={item.name} className="card-img-top dairy-img" />
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold text-light">{item.name}</h6>
                <span className="text-warning">⭐ {item.rating}</span>
                <h6 className="text-info mt-2">₹{item.price}</h6>
                <button onClick={() => handleAdd(item)} className="btn btn-info mt-auto">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn mx-1 ${currentPage === i + 1 ? "btn-info" : "btn-outline-info"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dairy;
