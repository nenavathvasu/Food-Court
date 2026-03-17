// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  logout, updateProfile, changePassword,
  clearUpdateSuccess, updateUserLocally,
} from "../features/auth/authSlice";
import { clearOrders } from "../features/orders/orderSlice";
import { fetchAllOrders } from "../features/orders/orderSlice";
import "../styles/profile.css";

// ── tiny Toggle component ─────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

// ── tab definitions ───────────────────────────────────────────
const TABS = [
  { id: "overview",    label: "Overview",        icon: "bi-grid" },
  { id: "edit",        label: "Edit Profile",     icon: "bi-person-gear" },
  { id: "password",    label: "Change Password",  icon: "bi-shield-lock" },
  { id: "orders",      label: "Order History",    icon: "bi-bag-check" },
  { id: "prefs",       label: "Preferences",      icon: "bi-sliders" },
];

export default function Profile() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { user, isAuthenticated, updateLoading, updateSuccess, error } =
    useSelector((s) => s.auth);
  const { list: orders }  = useSelector((s) => s.orders);
  const cartCount         = useSelector((s) => s.cart.items.length);

  const [tab, setTab] = useState("overview");

  // Edit profile form
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city:  user?.city  || "",
    address: user?.address || "",
  });

  // Password form
  const [pwForm,   setPwForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [showPw,   setShowPw]   = useState({ current: false, newPw: false, confirm: false });
  const [pwError,  setPwError]  = useState("");

  // Preferences
  const [prefs, setPrefs] = useState({
    emailOffers:    true,
    smsAlerts:      false,
    orderUpdates:   true,
    newsletter:     false,
    darkMode:       true,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  // Load user's orders
  useEffect(() => {
    if (user?.email) dispatch(fetchAllOrders(user.email));
  }, [dispatch, user?.email]);

  // Show toast on successful update
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully! ✅");
      dispatch(clearUpdateSuccess());
    }
  }, [updateSuccess, dispatch]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error("Name cannot be empty"); return; }
    // Optimistic update locally first (works even if backend returns 404)
    dispatch(updateUserLocally(profileForm));
    // Also try the real API
    dispatch(updateProfile(profileForm));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwError("");
    if (!pwForm.current)              { setPwError("Enter your current password"); return; }
    if (pwForm.newPw.length < 6)      { setPwError("New password must be at least 6 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    dispatch(changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setPwForm({ current: "", newPw: "", confirm: "" });
          toast.success("Password changed successfully! 🔒");
        }
      });
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone. All your data will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff4444",
      background: "#1a1a1a",
      color: "#f0f0f0",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearOrders());
        dispatch(logout());
      }
    });
  };

  const handleLogout = () => {
    dispatch(clearOrders());
    dispatch(logout());
  };

  // ── Derived stats ─────────────────────────────────────────────
  const totalSpent  = orders.reduce((s, o) => s + (o.finalTotal || 0), 0);
  const initials    = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  if (!isAuthenticated || !user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">

          {/* ── Sidebar ── */}
          <aside className="profile-sidebar">

            {/* Avatar card */}
            <div className="profile-avatar-card">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
                </div>
                <button className="profile-avatar-edit" title="Change photo">
                  <i className="bi bi-camera-fill" />
                </button>
              </div>
              <div className="profile-avatar-card__name">{user.name}</div>
              <div className="profile-avatar-card__email">{user.email}</div>
              <span className="profile-avatar-card__badge">
                <i className="bi bi-patch-check-fill" /> Member since {memberSince}
              </span>
            </div>

            {/* Stats */}
            <div className="profile-stats-card">
              <div className="profile-stat">
                <div className="profile-stat__num">{orders.length}</div>
                <div className="profile-stat__label">Orders</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat__num">₹{totalSpent.toLocaleString("en-IN")}</div>
                <div className="profile-stat__label">Spent</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat__num">{cartCount}</div>
                <div className="profile-stat__label">In Cart</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat__num">4.8★</div>
                <div className="profile-stat__label">Rating</div>
              </div>
            </div>

            {/* Tab nav */}
            <nav className="profile-nav">
              {TABS.map((t) => (
                <button key={t.id}
                  className={`profile-nav__item${tab === t.id ? " active" : ""}`}
                  onClick={() => setTab(t.id)}>
                  <i className={`bi ${t.icon}`} />
                  {t.label}
                  <i className="bi bi-chevron-right arrow" />
                </button>
              ))}
              <button className="profile-nav__item" onClick={handleLogout}
                style={{ color: "var(--primary)" }}>
                <i className="bi bi-box-arrow-right" />
                Logout
                <i className="bi bi-chevron-right arrow" />
              </button>
            </nav>
          </aside>

          {/* ── Main ── */}
          <main className="profile-main">
            <AnimatePresence mode="wait">

              {/* ── OVERVIEW ── */}
              {tab === "overview" && (
                <motion.div key="overview"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

                  {/* Welcome banner */}
                  <div className="profile-card" style={{ marginBottom: 20 }}>
                    <div style={{
                      padding: "28px 24px",
                      background: "linear-gradient(135deg, rgba(255,68,68,0.1) 0%, rgba(255,184,0,0.06) 100%)",
                      borderRadius: "var(--radius-lg)",
                      display: "flex", alignItems: "center", gap: 20,
                    }}>
                      <div className="profile-avatar" style={{ width: 60, height: 60, fontSize: "1.4rem", flexShrink: 0 }}>
                        {user.avatar ? <img src={user.avatar} alt="" /> : initials}
                      </div>
                      <div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", marginBottom: 4 }}>
                          Welcome back, {user.name?.split(" ")[0]}! 👋
                        </h2>
                        <p style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
                          Here's a summary of your FoodCourt activity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="profile-card">
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-person-lines-fill" /> Account Details
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setTab("edit")}>
                        <i className="bi bi-pencil" /> Edit
                      </button>
                    </div>
                    <div className="profile-card__body">
                      <div className="profile-form-grid">
                        {[
                          { label: "Full Name",    icon: "bi-person",       val: user.name    || "—" },
                          { label: "Email",        icon: "bi-envelope",     val: user.email   || "—" },
                          { label: "Phone",        icon: "bi-telephone",    val: user.phone   || "Not set" },
                          { label: "City",         icon: "bi-geo-alt",      val: user.city    || "Not set" },
                          { label: "Address",      icon: "bi-house",        val: user.address || "Not set", full: true },
                        ].map((field) => (
                          <div key={field.label}
                            className={`profile-form-group${field.full ? " full" : ""}`}>
                            <label>{field.label}</label>
                            <div style={{
                              display: "flex", alignItems: "center", gap: 8,
                              padding: "10px 14px",
                              background: "var(--bg-4)",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border)",
                              fontSize: "0.88rem",
                              color: field.val === "—" || field.val === "Not set" ? "var(--text-3)" : "var(--text)",
                            }}>
                              <i className={`bi ${field.icon}`} style={{ color: "var(--text-3)" }} />
                              {field.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent orders */}
                  <div className="profile-card">
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-bag-check" /> Recent Orders
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate("/orders")}>
                        View All <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                    <div className="profile-card__body">
                      {orders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)" }}>
                          <i className="bi bi-bag" style={{ fontSize: "2rem", display: "block", marginBottom: 10 }} />
                          No orders yet
                        </div>
                      ) : (
                        orders.slice(0, 4).map((order, idx) => (
                          <div key={order._id} className="profile-order-item">
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 2 }}>
                                Order #{orders.length - idx}
                              </div>
                              <div className="profile-order-item__id">{order._id}</div>
                              <div className="profile-order-item__date">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric"
                                }) : "—"}
                              </div>
                              <div className="profile-order-item__items">
                                {order.items?.slice(0, 2).map(i => i.name).join(", ")}
                                {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                              </div>
                            </div>
                            <div className="profile-order-item__total">₹{order.finalTotal}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── EDIT PROFILE ── */}
              {tab === "edit" && (
                <motion.div key="edit"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="profile-card">
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-person-gear" /> Edit Profile
                      </div>
                    </div>
                    <div className="profile-card__body">
                      {error && (
                        <div className="profile-alert profile-alert--error">
                          <i className="bi bi-exclamation-circle" /> {error}
                        </div>
                      )}
                      <form onSubmit={handleProfileSave}>
                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label>Full Name *</label>
                            <div className="input-wrap">
                              <i className="bi bi-person" />
                              <input className="input" type="text" placeholder="Your full name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                required />
                            </div>
                          </div>
                          <div className="profile-form-group">
                            <label>Email *</label>
                            <div className="input-wrap">
                              <i className="bi bi-envelope" />
                              <input className="input" type="email" placeholder="your@email.com"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                required />
                            </div>
                          </div>
                          <div className="profile-form-group">
                            <label>Phone Number</label>
                            <div className="input-wrap">
                              <i className="bi bi-telephone" />
                              <input className="input" type="tel" placeholder="+91 98765 43210"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                            </div>
                          </div>
                          <div className="profile-form-group">
                            <label>City</label>
                            <div className="input-wrap">
                              <i className="bi bi-geo-alt" />
                              <input className="input" type="text" placeholder="Hyderabad"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} />
                            </div>
                          </div>
                          <div className="profile-form-group full">
                            <label>Delivery Address</label>
                            <div className="input-wrap">
                              <i className="bi bi-house" />
                              <input className="input" type="text" placeholder="Street, Area, Landmark"
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                          <button className="btn btn-primary" type="submit" disabled={updateLoading}>
                            {updateLoading
                              ? <><span className="spinner-border spinner-border-sm" /> Saving…</>
                              : <><i className="bi bi-check2" /> Save Changes</>}
                          </button>
                          <button className="btn btn-ghost" type="button" onClick={() => setTab("overview")}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── CHANGE PASSWORD ── */}
              {tab === "password" && (
                <motion.div key="password"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="profile-card">
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-shield-lock" /> Change Password
                      </div>
                    </div>
                    <div className="profile-card__body">
                      {pwError && (
                        <div className="profile-alert profile-alert--error">
                          <i className="bi bi-exclamation-circle" /> {pwError}
                        </div>
                      )}
                      <form onSubmit={handlePasswordChange} style={{ maxWidth: 460 }}>
                        {/* Security tip */}
                        <div style={{
                          display: "flex", gap: 10, padding: "12px 16px",
                          background: "rgba(59,130,246,0.08)",
                          border: "1px solid rgba(59,130,246,0.2)",
                          borderRadius: "var(--radius-md)", marginBottom: 20,
                          fontSize: "0.83rem", color: "#93c5fd",
                        }}>
                          <i className="bi bi-info-circle" style={{ flexShrink: 0, marginTop: 2 }} />
                          Use at least 6 characters with a mix of letters and numbers for a strong password.
                        </div>

                        {[
                          { key: "current", label: "Current Password",  placeholder: "Enter current password" },
                          { key: "newPw",   label: "New Password",      placeholder: "Enter new password" },
                          { key: "confirm", label: "Confirm Password",  placeholder: "Re-enter new password" },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key} className="profile-form-group" style={{ marginBottom: 16 }}>
                            <label>{label}</label>
                            <div className="input-wrap">
                              <i className="bi bi-lock" />
                              <input className="input"
                                type={showPw[key] ? "text" : "password"}
                                placeholder={placeholder}
                                value={pwForm[key]}
                                onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} />
                              <button type="button" className="toggle-pw"
                                onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}>
                                <i className={`bi bi-eye${showPw[key] ? "-slash" : ""}`} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Strength indicator */}
                        {pwForm.newPw && (
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: "0.76rem", color: "var(--text-3)", marginBottom: 6 }}>
                              Password strength
                            </div>
                            <div style={{ display: "flex", gap: 4 }}>
                              {[
                                pwForm.newPw.length >= 6,
                                /[A-Z]/.test(pwForm.newPw),
                                /[0-9]/.test(pwForm.newPw),
                                /[^A-Za-z0-9]/.test(pwForm.newPw),
                              ].map((met, i) => (
                                <div key={i} style={{
                                  flex: 1, height: 4, borderRadius: 99,
                                  background: met
                                    ? i < 2 ? "#f59e0b" : "#22c55e"
                                    : "var(--bg-4)",
                                  transition: "background 0.3s",
                                }} />
                              ))}
                            </div>
                          </div>
                        )}

                        <button className="btn btn-primary" type="submit" disabled={updateLoading}>
                          {updateLoading
                            ? <><span className="spinner-border spinner-border-sm" /> Updating…</>
                            : <><i className="bi bi-shield-check" /> Update Password</>}
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ORDER HISTORY ── */}
              {tab === "orders" && (
                <motion.div key="orders"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="profile-card">
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-bag-check" /> Order History
                      </div>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
                        {orders.length} order{orders.length !== 1 && "s"}
                      </span>
                    </div>
                    <div className="profile-card__body">
                      {orders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                          <div style={{ fontSize: "3rem", opacity: 0.3, marginBottom: 12 }}>📦</div>
                          <h4 style={{ fontWeight: 700, marginBottom: 8 }}>No orders yet</h4>
                          <p style={{ color: "var(--text-2)", marginBottom: 20 }}>Your order history will appear here.</p>
                          <button className="btn btn-primary btn-pill" onClick={() => navigate("/veg")}>
                            Browse Menu
                          </button>
                        </div>
                      ) : (
                        orders.map((order, idx) => (
                          <div key={order._id} className="profile-order-item">
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 2 }}>
                                Order #{orders.length - idx}
                                <span style={{
                                  marginLeft: 10, padding: "2px 8px",
                                  background: "rgba(34,197,94,0.1)",
                                  color: "var(--green)",
                                  borderRadius: 99, fontSize: "0.7rem", fontWeight: 700,
                                }}>Delivered</span>
                              </div>
                              <div className="profile-order-item__id">{order._id}</div>
                              <div className="profile-order-item__date">
                                {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                                }) : "—"}
                              </div>
                              <div className="profile-order-item__items">
                                {order.items?.map(i => `${i.name} ×${i.qty}`).join(", ")}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div className="profile-order-item__total">₹{order.finalTotal}</div>
                              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}
                                onClick={() => navigate("/orders")}>
                                Details
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PREFERENCES ── */}
              {tab === "prefs" && (
                <motion.div key="prefs"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

                  {/* Notifications */}
                  <div className="profile-card" style={{ marginBottom: 20 }}>
                    <div className="profile-card__header">
                      <div className="profile-card__title">
                        <i className="bi bi-bell" /> Notifications
                      </div>
                    </div>
                    <div className="profile-card__body">
                      {[
                        { key: "emailOffers",  label: "Email Offers",    desc: "Get discount codes and promotions via email" },
                        { key: "smsAlerts",    label: "SMS Alerts",      desc: "Receive order and delivery updates via SMS" },
                        { key: "orderUpdates", label: "Order Updates",   desc: "Real-time notifications for your orders" },
                        { key: "newsletter",   label: "Newsletter",      desc: "Weekly newsletter with new dishes and offers" },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="profile-pref-item">
                          <div>
                            <div className="profile-pref-item__label">{label}</div>
                            <div className="profile-pref-item__desc">{desc}</div>
                          </div>
                          <Toggle
                            checked={prefs[key]}
                            onChange={(v) => {
                              setPrefs({ ...prefs, [key]: v });
                              toast.info(`${label} ${v ? "enabled" : "disabled"}`);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="profile-danger-zone">
                    <h5><i className="bi bi-exclamation-triangle" /> Danger Zone</h5>
                    <p>
                      Permanently delete your account and all associated data.
                      This action cannot be reversed.
                    </p>
                    <button className="btn btn-sm"
                      style={{ background: "rgba(255,68,68,0.1)", color: "var(--primary)", border: "1px solid rgba(255,68,68,0.3)" }}
                      onClick={handleDeleteAccount}>
                      <i className="bi bi-trash" /> Delete Account
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}