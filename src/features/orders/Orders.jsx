// src/features/orders/Orders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllOrders } from "./orderSlice";
import "../../styles/pages.css";

export default function Orders() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { list: orders, loading, error } = useSelector((s) => s.orders);
  const { isAuthenticated, user }        = useSelector((s) => s.auth);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Pass the user's email so the slice filters only their orders
    dispatch(fetchAllOrders(user?.email));
  }, [dispatch, isAuthenticated, user?.email, navigate]);

  // ── Loading ──
  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <i className="bi bi-exclamation-triangle"
        style={{ fontSize: "2.5rem", display: "block", marginBottom: 12, color: "var(--primary)" }} />
      <p style={{ color: "var(--text-2)" }}>{error}</p>
      <button className="btn btn-ghost btn-pill" style={{ marginTop: 16 }}
        onClick={() => dispatch(fetchAllOrders(user?.email))}>
        Try Again
      </button>
    </div>
  );

  // ── Not logged in (belt-and-suspenders) ──
  if (!isAuthenticated) return null;

  // ── Empty ──
  if (!orders.length) return (
    <div className="orders-page">
      <div className="container" style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: "4rem", opacity: 0.3, marginBottom: 16 }}>📦</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, marginBottom: 8 }}>
          No orders yet
        </h3>
        <p style={{ color: "var(--text-2)", marginBottom: 24 }}>
          You haven't placed any orders yet. Start browsing!
        </p>
        <button className="btn btn-primary btn-lg btn-pill" onClick={() => navigate("/veg")}>
          Browse Menu
        </button>
      </div>
    </div>
  );

  // ── Orders list ──
  return (
    <div className="orders-page">
      <div className="container">
        <h2 className="orders-page__title">📦 My Orders</h2>

        {/* User context strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--bg-3)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)", padding: "10px 16px",
          marginBottom: 28, width: "fit-content",
        }}>
          <i className="bi bi-person-circle" style={{ color: "var(--primary)", fontSize: "1.1rem" }} />
          <span style={{ fontSize: "0.88rem", color: "var(--text-2)" }}>
            Showing orders for <strong style={{ color: "var(--text)" }}>{user?.email}</strong>
          </span>
          <span style={{
            marginLeft: 8, background: "var(--primary-glow)",
            color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700,
            padding: "2px 10px", borderRadius: 99,
          }}>
            {orders.length} order{orders.length !== 1 && "s"}
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: 20,
        }}>
          {orders.map((order, idx) => (
            <motion.div key={order._id} className="order-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}>

              {/* Header */}
              <div className="order-card__header">
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 3 }}>
                    Order #{orders.length - idx}
                  </div>
                  <div className="order-card__id">{order._id}</div>
                </div>
                <div className="order-card__date">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "—"}
                </div>
              </div>

              {/* Items */}
              <div className="order-card__body">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-card__item">
                    <span>
                      {item.name}{" "}
                      <span style={{ color: "var(--text-3)" }}>×{item.qty}</span>
                    </span>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                      ₹{item.total}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill summary */}
              <div className="order-card__totals">
                <span className="order-card__total-item">
                  Subtotal: ₹{order.subtotal}
                </span>
                {order.discountPercent > 0 && (
                  <span className="order-card__total-item" style={{ color: "var(--green)" }}>
                    Discount ({order.discountPercent}%): −₹{order.discountedAmount}
                  </span>
                )}
                <span className="order-card__total-item">
                  GST: ₹{order.gst}
                </span>
                <span className="order-card__total-item order-card__final">
                  Total: ₹{order.finalTotal}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}