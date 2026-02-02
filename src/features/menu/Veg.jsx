import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVeg } from "./vegSlice";
import { addToCart } from "../cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Veg() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: VegItems, loading } = useSelector((state) => state.veg);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    dispatch(fetchVeg());
    window.addEventListener("scroll", () => {
      setShowTop(window.scrollY > 300);
    });
  }, [dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart 🛒`);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  let items = VegItems || [];

  if (search)
    items = items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );

  if (sortOrder === "low") items.sort((a, b) => a.price - b.price);
  if (sortOrder === "high") items.sort((a, b) => b.price - a.price);

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #ffecd2, #fcb69f)",
      }}
    >
      <div className="container py-4">

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-danger">🥗 Veg Specials</h2>
          <p className="text-muted">Healthy • Tasty • Fresh</p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="card shadow-sm border-0 p-3 mb-4 sticky-top" style={{ top: "70px", backdropFilter: "blur(10px)" }}>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="🔍 Search dishes..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Sort By</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>
            <div className="col-md-3 text-end small text-muted d-flex align-items-center justify-content-end">
              {items.length} items found
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="row g-4">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <div className="card placeholder-glow shadow-sm">
                  <div className="placeholder card-img-top" style={{ height: "180px" }}></div>
                  <div className="card-body">
                    <p className="placeholder col-6"></p>
                    <p className="placeholder col-7"></p>
                    <p className="placeholder col-4"></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {items.map(item => (
              <div key={item._id} className="col-md-3 col-sm-6">
                <div className="card h-100 shadow-sm border-0 food-card">

                  <div className="position-relative">
                    <img
                      src={item.image}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "180px", objectFit: "cover" }}
                    />

                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      ⭐ {item.rating || 4.2}
                    </span>

                    <span className="badge bg-warning text-dark position-absolute bottom-0 start-0 m-2">
                      Bestseller
                    </span>

                    <button
                      className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => toggleWishlist(item._id)}
                    >
                      {wishlist.includes(item._id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold">{item.name}</h6>
                    <p className="text-muted small">Fresh & delicious</p>
                    <h5 className="text-danger">₹{item.price}</h5>

                    <button
                      className="btn btn-danger mt-auto"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <button
        onClick={() => navigate("/cart")}
        className="btn btn-danger rounded-circle shadow-lg position-fixed"
        style={{ bottom: "20px", right: "20px", width: "65px", height: "65px" }}
      >
        🛒
      </button>

      {/* Scroll To Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn btn-warning rounded-circle shadow position-fixed"
          style={{ bottom: "95px", right: "22px", width: "55px", height: "55px" }}
        >
          ⬆
        </button>
      )}
    </div>
  );
}

export default Veg;
