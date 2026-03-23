// src/features/payment/Payment.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { setCodSuccess, resetPayment } from "./paymentSlice";
import { placeOrder, clearCart, selectCartTotals } from "../cart/cartSlice";
import "../../styles/pages.css";

// ── Address Form ─────────────────────────────────────────────
function AddressForm({ address, onChange, onContinue }) {
  const fields = [
    { key: "name",    label: "Full Name",       icon: "bi-person-fill",    type: "text",   ph: "Recipient name" },
    { key: "phone",   label: "Phone Number",    icon: "bi-telephone-fill", type: "tel",    ph: "+91 98765 43210" },
    { key: "address", label: "Street Address",  icon: "bi-house-fill",     type: "text",   ph: "Street, Area, Landmark", full: true },
    { key: "city",    label: "City",            icon: "bi-geo-alt-fill",   type: "text",   ph: "Hyderabad" },
    { key: "pincode", label: "Pincode",         icon: "bi-hash",           type: "number", ph: "500001" },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <div style={styles.stepDot}>1</div>
          <div>
            <div style={styles.cardTitle}>Delivery Address</div>
            <div style={styles.cardSub}>Where should we deliver your order?</div>
          </div>
        </div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.formGrid}>
          {fields.map(({ key, label, icon, type, ph, full }) => (
            <div key={key} style={{ ...styles.formGroup, ...(full ? styles.formGroupFull : {}) }}>
              <label style={styles.label}>{label}</label>
              <div style={styles.inputWrap}>
                <i className={`bi ${icon}`} style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type={type}
                  placeholder={ph}
                  value={address[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  autoComplete="off"
                  onFocus={e => e.target.style.borderColor = "#ff4444"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
            </div>
          ))}
        </div>
        <button style={styles.btnPrimary} onClick={onContinue}>
          Continue to Review &nbsp;<i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, discountPercentage } = useSelector((s) => s.cart);
  const totals                        = useSelector(selectCartTotals);
  const { user }                      = useSelector((s) => s.auth);
  const { success, loading }          = useSelector((s) => s.payment);

  const [step, setStep] = useState("address");
  const [address, setAddress] = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
    city:    user?.city    || "Hyderabad",
    pincode: "",
  });

  useEffect(() => {
    if (!items.length && step !== "success") navigate("/cart");
  }, [items.length, step, navigate]);

  useEffect(() => {
    if (success) setStep("success");
  }, [success]);

  const handleAddressChange = (key, value) =>
    setAddress((prev) => ({ ...prev, [key]: value }));

  const handleAddressContinue = () => {
    if (!address.name.trim() || !address.phone.trim() || !address.address.trim()) {
      toast.error("Please fill in name, phone and address");
      return;
    }
    setStep("review");
  };

  const handleConfirmOrder = () => {
    if (!user?.email) { toast.error("Please login"); navigate("/login"); return; }
    setStep("processing");
    const formattedItems = items.map((i) => ({
      id: Number(i._id || i.id), name: i.name,
      price: i.price, qty: i.quantity, total: i.price * i.quantity,
    }));
    setTimeout(() => {
      dispatch(placeOrder({
        customerEmail:    user.email,
        items:            formattedItems,
        subtotal:         totals.subtotal,
        discountPercent:  discountPercentage,
        discountedAmount: totals.discountAmount,
        gst:              totals.gst,
        finalTotal:       totals.total,
        paymentMethod:    "cod",
        paymentStatus:    "pending",
        deliveryAddress:  address,
      }));
      dispatch(clearCart());
      dispatch(setCodSuccess());
    }, 1600);
  };

  const STEPS = ["Address", "Review", "Confirmed"];
  const stepIndex = { address: 0, review: 1, processing: 1, success: 2 };
  const currentStepIdx = stepIndex[step] ?? 0;

  return (
    <div style={styles.page}>
      {/* Background decorative elements */}
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />

      <div style={styles.container}>

        {/* ── Header ── */}
        <div style={styles.pageHeader}>
          <button style={styles.backBtn} onClick={() => navigate("/cart")}>
            <i className="bi bi-arrow-left" />
          </button>
          <div>
            <h1 style={styles.pageTitle}>Checkout</h1>
            <p style={styles.pageSub}>{items.length} item{items.length !== 1 && "s"} · ₹{totals.total} total</p>
          </div>
        </div>

        {/* ── Progress Steps ── */}
        <div style={styles.progressWrap}>
          {STEPS.map((label, i) => {
            const active = i === currentStepIdx;
            const done   = i < currentStepIdx;
            return (
              <React.Fragment key={label}>
                <div style={styles.stepItem}>
                  <motion.div
                    style={{
                      ...styles.stepCircle,
                      ...(done   ? styles.stepCircleDone   : {}),
                      ...(active ? styles.stepCircleActive : {}),
                    }}
                    animate={{ scale: active ? [1, 1.08, 1] : 1 }}
                    transition={{ repeat: active ? Infinity : 0, duration: 2 }}
                  >
                    {done
                      ? <i className="bi bi-check2" style={{ fontSize: 13 }} />
                      : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    }
                  </motion.div>
                  <span style={{
                    ...styles.stepLabel,
                    color: active ? "#f0f0f0" : done ? "#22c55e" : "rgba(255,255,255,0.3)",
                  }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ ...styles.stepLine, background: done ? "#22c55e" : "rgba(255,255,255,0.08)" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Main Layout ── */}
        <div style={styles.layout}>

          {/* Left — Steps */}
          <div style={styles.main}>
            <AnimatePresence mode="wait">

              {/* Step 1 — Address */}
              {step === "address" && (
                <motion.div key="address"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                  <AddressForm
                    address={address}
                    onChange={handleAddressChange}
                    onContinue={handleAddressContinue}
                  />
                </motion.div>
              )}

              {/* Step 2 — Review */}
              {step === "review" && (
                <motion.div key="review"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

                  {/* Address review */}
                  <div style={{ ...styles.card, marginBottom: 16 }}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardHeaderLeft}>
                        <div style={{ ...styles.stepDot, background: "#22c55e" }}>
                          <i className="bi bi-check2" style={{ fontSize: 12 }} />
                        </div>
                        <div>
                          <div style={styles.cardTitle}>Delivering To</div>
                          <div style={styles.cardSub}>{address.address}, {address.city}</div>
                        </div>
                      </div>
                      <button style={styles.btnEdit} onClick={() => setStep("address")}>
                        <i className="bi bi-pencil" /> Edit
                      </button>
                    </div>
                    <div style={{ ...styles.cardBody, paddingTop: 0 }}>
                      <div style={styles.addressGrid}>
                        {[
                          { icon: "bi-person-fill",    val: address.name },
                          { icon: "bi-telephone-fill", val: address.phone },
                          { icon: "bi-geo-alt-fill",   val: address.pincode ? `${address.city} — ${address.pincode}` : address.city },
                        ].filter(x => x.val).map(({ icon, val }) => (
                          <div key={icon} style={styles.addressRow}>
                            <i className={`bi ${icon}`} style={{ color: "var(--primary, #ff4444)", fontSize: 13 }} />
                            <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div style={{ ...styles.card, marginBottom: 20 }}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardHeaderLeft}>
                        <div style={styles.stepDot}>2</div>
                        <div>
                          <div style={styles.cardTitle}>Payment Method</div>
                          <div style={styles.cardSub}>How would you like to pay?</div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardBody}>
                      {/* COD option */}
                      <div style={styles.payMethod}>
                        <div style={styles.payMethodRadioActive} />
                        <div style={styles.payMethodIcon}>
                          <i className="bi bi-cash-stack" style={{ fontSize: 20, color: "#22c55e" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>Cash on Delivery</div>
                          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>Pay when your order arrives at your door</div>
                        </div>
                        <div style={styles.payMethodBadge}>Selected</div>
                      </div>

                      {/* Info note */}
                      <div style={styles.infoNote}>
                        <i className="bi bi-info-circle-fill" style={{ color: "#ffb800", flexShrink: 0 }} />
                        <span>Keep <strong style={{ color: "#ffb800" }}>₹{totals.total}</strong> ready. Our delivery partner will collect it at your door.</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm CTA */}
                  <motion.button
                    style={styles.btnConfirm}
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bi bi-bag-check-fill" style={{ fontSize: 18 }} />
                    <span>Confirm Order</span>
                    <span style={styles.btnConfirmPrice}>₹{totals.total}</span>
                  </motion.button>

                  <div style={styles.secureNote}>
                    <i className="bi bi-shield-fill-check" style={{ color: "#22c55e" }} />
                    <span>Secure order · Delivered in 30–40 min · Easy cancellation</span>
                  </div>
                </motion.div>
              )}

              {/* Processing */}
              {step === "processing" && (
                <motion.div key="processing" style={styles.processingWrap}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={styles.spinnerWrap}>
                    <motion.div
                      style={styles.spinnerRing}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                    <div style={styles.spinnerIcon}>
                      <i className="bi bi-bag-fill" style={{ fontSize: 28, color: "#ff4444" }} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>Placing your order…</h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>Hang tight, this takes just a second</p>
                </motion.div>
              )}

              {/* Success */}
              {step === "success" && (
                <motion.div key="success" style={styles.successWrap}
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180 }}>

                  <motion.div style={styles.successIcon}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 220 }}>
                    <i className="bi bi-check-circle-fill" style={{ fontSize: 56, color: "#22c55e" }} />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}>Order Confirmed! 🎉</h2>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", maxWidth: 380, margin: "0 auto 24px" }}>
                      Delivering to <strong style={{ color: "#f0f0f0" }}>{address.address}, {address.city}</strong> in <strong style={{ color: "#f0f0f0" }}>30–40 minutes</strong>.
                    </p>
                  </motion.div>

                  <motion.div style={styles.codNote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <i className="bi bi-cash-coin" style={{ fontSize: 20, color: "#ffb800" }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>Keep cash ready</div>
                      <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                        Pay <strong style={{ color: "#ffb800" }}>₹{totals.total}</strong> to the delivery partner
                      </div>
                    </div>
                  </motion.div>

                  <motion.div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <button style={styles.btnPrimary}
                      onClick={() => { dispatch(resetPayment()); navigate("/orders"); }}>
                      <i className="bi bi-bag-check" /> Track Order
                    </button>
                    <button style={styles.btnGhost}
                      onClick={() => { dispatch(resetPayment()); navigate("/home"); }}>
                      Back to Home
                    </button>
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right — Order Summary */}
          {step !== "success" && (
            <motion.div style={styles.sidebar}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={styles.card}>
                <div style={{ ...styles.cardHeader, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16, marginBottom: 16 }}>
                  <div style={styles.cardTitle}>
                    <i className="bi bi-receipt" style={{ color: "#ff4444", marginRight: 8 }} />
                    Order Summary
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>{items.length} items</span>
                </div>
                <div style={styles.cardBody}>

                  {/* Items list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                    {items.map((item) => (
                      <div key={item._id || item.id} style={styles.summaryItem}>
                        <div style={styles.summaryImgWrap}>
                          <img src={item.image} alt={item.name} style={styles.summaryImg} />
                          <div style={styles.summaryQtyBadge}>{item.quantity}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                            ₹{item.price} × {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#ffb800", flexShrink: 0 }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

                  {/* Bill rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Subtotal",                                    val: `₹${totals.subtotal}`,       color: "rgba(255,255,255,0.6)" },
                      totals.discountAmount > 0
                        ? { label: `Discount (${discountPercentage}%)`,       val: `−₹${totals.discountAmount}`, color: "#22c55e" }
                        : null,
                      { label: "GST (5%)",                                    val: `₹${totals.gst}`,            color: "rgba(255,255,255,0.6)" },
                      { label: "Delivery fee",                                val: `₹${totals.delivery}`,       color: "rgba(255,255,255,0.6)" },
                      { label: "Platform fee",                                val: `₹${totals.handling}`,       color: "rgba(255,255,255,0.6)" },
                    ].filter(Boolean).map(({ label, val, color }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}>
                        <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                        <span style={{ color, fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={styles.totalRow}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Total payable</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffb800", letterSpacing: "-0.5px" }}>
                        ₹{totals.total}
                      </div>
                    </div>
                    <div style={styles.codBadge}>
                      <i className="bi bi-cash" style={{ fontSize: 12 }} /> Cash
                    </div>
                  </div>

                  {/* ETA */}
                  <div style={styles.etaRow}>
                    <i className="bi bi-lightning-charge-fill" style={{ color: "#ffb800" }} />
                    <span>Estimated delivery <strong>30–40 min</strong></span>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    paddingBottom: 80,
    position: "relative",
    overflow: "hidden",
  },
  bgBlob1: {
    position: "fixed", top: "-20%", right: "-10%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,68,68,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgBlob2: {
    position: "fixed", bottom: "-20%", left: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,184,0,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 1100, margin: "0 auto", padding: "0 24px",
  },
  pageHeader: {
    display: "flex", alignItems: "center", gap: 16,
    paddingTop: 40, paddingBottom: 32,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f0f0f0", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
  pageTitle: {
    fontSize: "1.8rem", fontWeight: 800, color: "#f0f0f0",
    margin: 0, lineHeight: 1.2,
  },
  pageSub: {
    fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", margin: 0,
  },

  // Progress
  progressWrap: {
    display: "flex", alignItems: "center",
    marginBottom: 40, maxWidth: 420,
  },
  stepItem: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  },
  stepCircle: {
    width: 34, height: 34, borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.3)",
  },
  stepCircleActive: {
    background: "#ff4444",
    border: "1px solid #ff4444",
    color: "#fff",
    boxShadow: "0 0 20px rgba(255,68,68,0.4)",
  },
  stepCircleDone: {
    background: "#22c55e",
    border: "1px solid #22c55e",
    color: "#fff",
  },
  stepLabel: {
    fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5,
  },
  stepLine: {
    flex: 1, height: 1, margin: "0 8px", marginBottom: 22,
    transition: "background 0.4s",
  },

  // Layout
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 24,
    alignItems: "start",
  },
  main: { minWidth: 0 },
  sidebar: { position: "sticky", top: 80 },

  // Card
  card: {
    background: "#141414",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  cardHeaderLeft: {
    display: "flex", alignItems: "center", gap: 14,
  },
  cardTitle: {
    fontWeight: 700, fontSize: "1rem", color: "#f0f0f0",
  },
  cardSub: {
    fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 2,
  },
  cardBody: {
    padding: "0 24px 24px",
  },
  stepDot: {
    width: 32, height: 32, borderRadius: "50%",
    background: "#ff4444",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
  },

  // Form
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 4,
  },
  formGroup: {},
  formGroupFull: { gridColumn: "1 / -1" },
  label: {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "rgba(255,255,255,0.45)", marginBottom: 6, letterSpacing: 0.3,
  },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.25)", fontSize: 13, pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "11px 14px 11px 36px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, color: "#f0f0f0",
    fontSize: "0.9rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s",
  },

  // Buttons
  btnPrimary: {
    width: "100%", padding: "14px 24px",
    background: "linear-gradient(135deg, #ff4444, #cc2222)",
    border: "none", borderRadius: 14,
    color: "#fff", fontWeight: 700, fontSize: "0.95rem",
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 8px 24px rgba(255,68,68,0.3)",
    fontFamily: "inherit",
  },
  btnGhost: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14, color: "#f0f0f0",
    fontWeight: 600, fontSize: "0.9rem",
    cursor: "pointer", fontFamily: "inherit",
  },
  btnEdit: {
    padding: "6px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, color: "rgba(255,255,255,0.6)",
    fontSize: "0.8rem", fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
    fontFamily: "inherit",
  },
  btnConfirm: {
    width: "100%", padding: "16px 28px",
    background: "linear-gradient(135deg, #ff4444 0%, #cc1f1f 100%)",
    border: "none", borderRadius: 16,
    color: "#fff", fontWeight: 800, fontSize: "1.05rem",
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 12,
    boxShadow: "0 12px 32px rgba(255,68,68,0.35)",
    fontFamily: "inherit", letterSpacing: "-0.2px",
  },
  btnConfirmPrice: {
    marginLeft: "auto", padding: "2px 12px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: 8, fontSize: "0.95rem",
  },

  // Address
  addressGrid: {
    display: "flex", flexDirection: "column", gap: 8,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.04)",
  },
  addressRow: {
    display: "flex", alignItems: "center", gap: 10,
  },

  // Payment method
  payMethod: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "16px",
    background: "rgba(34,197,94,0.06)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: 14, marginBottom: 12,
  },
  payMethodRadioActive: {
    width: 18, height: 18, borderRadius: "50%",
    border: "5px solid #22c55e", flexShrink: 0,
  },
  payMethodIcon: {
    width: 44, height: 44, borderRadius: 12,
    background: "rgba(34,197,94,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  payMethodBadge: {
    padding: "3px 10px",
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 99, fontSize: "0.72rem",
    fontWeight: 700, color: "#22c55e",
    letterSpacing: 0.5, textTransform: "uppercase",
  },

  // Notes
  infoNote: {
    display: "flex", alignItems: "flex-start", gap: 10,
    padding: "12px 14px",
    background: "rgba(255,184,0,0.06)",
    border: "1px solid rgba(255,184,0,0.15)",
    borderRadius: 12, fontSize: "0.83rem",
    color: "rgba(255,255,255,0.6)", lineHeight: 1.5,
  },
  secureNote: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 14, fontSize: "0.78rem", color: "rgba(255,255,255,0.3)",
  },

  // Processing
  processingWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 20px", textAlign: "center",
  },
  spinnerWrap: {
    width: 80, height: 80, position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 28,
  },
  spinnerRing: {
    position: "absolute", inset: 0, borderRadius: "50%",
    border: "3px solid rgba(255,68,68,0.15)",
    borderTopColor: "#ff4444",
  },
  spinnerIcon: {
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Success
  successWrap: {
    textAlign: "center", padding: "60px 20px",
  },
  successIcon: {
    marginBottom: 24, display: "inline-block",
  },

  codNote: {
    display: "inline-flex", alignItems: "center", gap: 14,
    padding: "16px 24px",
    background: "rgba(255,184,0,0.07)",
    border: "1px solid rgba(255,184,0,0.2)",
    borderRadius: 16, textAlign: "left",
    maxWidth: 340,
  },

  // Summary sidebar
  summaryItem: {
    display: "flex", alignItems: "center", gap: 12,
  },
  summaryImgWrap: {
    position: "relative", flexShrink: 0,
  },
  summaryImg: {
    width: 44, height: 44, borderRadius: 10,
    objectFit: "cover", display: "block",
  },
  summaryQtyBadge: {
    position: "absolute", top: -6, right: -6,
    width: 18, height: 18, borderRadius: "50%",
    background: "#ff4444", color: "#fff",
    fontSize: 10, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 0",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    margin: "16px 0",
  },
  codBadge: {
    padding: "6px 14px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: 99, fontSize: "0.75rem",
    fontWeight: 700, color: "#22c55e",
    display: "flex", alignItems: "center", gap: 5,
  },
  etaRow: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: "0.8rem", color: "rgba(255,255,255,0.4)",
    padding: "10px 14px",
    background: "rgba(255,184,0,0.04)",
    borderRadius: 10, border: "1px solid rgba(255,184,0,0.08)",
  },
};