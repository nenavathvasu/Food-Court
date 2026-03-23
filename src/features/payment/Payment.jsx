// src/features/payment/Payment.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { setCodSuccess, resetPayment } from "./paymentSlice";
import { placeOrder, clearCart, selectCartTotals } from "../cart/cartSlice";
import "../../styles/pages.css";


// ── AddressForm — defined OUTSIDE so it never remounts ──
function AddressForm({ address, onChange, onContinue }) {
  const fields = [
    { key: "name",    label: "Full Name",  icon: "bi-person",    type: "text",   ph: "Recipient name" },
    { key: "phone",   label: "Phone",      icon: "bi-telephone", type: "tel",    ph: "+91 98765 43210" },
    { key: "address", label: "Address",    icon: "bi-house",     type: "text",   ph: "Street, Area, Landmark", full: true },
    { key: "city",    label: "City",       icon: "bi-geo-alt",   type: "text",   ph: "Hyderabad" },
    { key: "pincode", label: "Pincode",    icon: "bi-hash",      type: "number", ph: "500001" },
  ];

  return (
    <div className="payment-card">
      <div className="payment-card__header">
        <div className="payment-card__title">
          <i className="bi bi-geo-alt-fill" /> Delivery Address
        </div>
      </div>
      <div className="payment-card__body">
        <div className="payment-form-grid">
          {fields.map(({ key, label, icon, type, ph, full }) => (
            <div key={key} className={`payment-form-group${full ? " full" : ""}`}>
              <label>{label}</label>
              <div className="input-wrap">
                <i className={`bi ${icon}`} />
                <input
                  className="input"
                  type={type}
                  placeholder={ph}
                  value={address[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 20 }}
          onClick={onContinue}
        >
          Continue to Review <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────
export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, discountPercentage } = useSelector((s) => s.cart);
  const totals                        = useSelector(selectCartTotals);
  const { user }                      = useSelector((s) => s.auth);
  const { success, loading }          = useSelector((s) => s.payment);

  const [step,        setStep]        = useState("address"); // "address" | "review" | "processing" | "success"
  const [address,     setAddress]     = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
    city:    user?.city    || "Hyderabad",
    pincode: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!items.length && step !== "success") navigate("/cart");
  }, [items.length, step, navigate]);

  // React to success from Redux
  useEffect(() => {
    if (success) setStep("success");
  }, [success]);

  // Stable address field handler
  const handleAddressChange = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressContinue = () => {
    if (!address.name.trim() || !address.phone.trim() || !address.address.trim()) {
      toast.error("Please fill in name, phone and address");
      return;
    }
    setStep("review");
  };

  // ── Place COD order ──────────────────────────────────
  const handleConfirmOrder = () => {
    if (!user?.email) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setStep("processing");

    const formattedItems = items.map((i) => ({
      id:    Number(i._id || i.id),
      name:  i.name,
      price: i.price,
      qty:   i.quantity,
      total: i.price * i.quantity,
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
    }, 1400);
  };

  // ── Progress step indicator ──────────────────────────
  const STEPS = ["Address", "Review", "Confirmation"];
  const stepIndex = { address: 0, review: 1, processing: 1, success: 2 };
  const currentStepIdx = stepIndex[step] ?? 0;

  return (
    <div className="payment-page">
      <div className="container">

        {/* Progress bar */}
        <div className="payment-steps">
          {STEPS.map((label, i) => {
            const active = i === currentStepIdx;
            const done   = i < currentStepIdx;
            return (
              <React.Fragment key={label}>
                <div className={`payment-step${active ? " active" : ""}${done ? " done" : ""}`}>
                  <div className="payment-step__num">
                    {done ? <i className="bi bi-check2" /> : i + 1}
                  </div>
                  <span>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`payment-step__line${done ? " done" : ""}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="payment-layout">
          <div className="payment-main">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Address ── */}
              {step === "address" && (
                <motion.div key="address"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <AddressForm
                    address={address}
                    onChange={handleAddressChange}
                    onContinue={handleAddressContinue}
                  />
                </motion.div>
              )}

              {/* ── Step 2: Review & Confirm ── */}
              {step === "review" && (
                <motion.div key="review"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>

                  {/* Delivery address review */}
                  <div className="payment-card" style={{ marginBottom: 16 }}>
                    <div className="payment-card__header">
                      <div className="payment-card__title">
                        <i className="bi bi-geo-alt-fill" /> Delivering To
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setStep("address")}>
                        <i className="bi bi-pencil" /> Edit
                      </button>
                    </div>
                    <div className="payment-card__body">
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                          { icon: "bi-person",    val: address.name },
                          { icon: "bi-telephone", val: address.phone },
                          { icon: "bi-house",     val: address.address },
                          { icon: "bi-geo-alt",   val: `${address.city}${address.pincode ? ` — ${address.pincode}` : ""}` },
                        ].map(({ icon, val }) => val && (
                          <div key={icon} style={{ display: "flex", gap: 10, fontSize: "0.9rem", alignItems: "center" }}>
                            <i className={`bi ${icon}`} style={{ color: "var(--text-3)", width: 16 }} />
                            <span>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment method — COD only */}
                  <div className="payment-card" style={{ marginBottom: 16 }}>
                    <div className="payment-card__header">
                      <div className="payment-card__title">
                        <i className="bi bi-credit-card" /> Payment Method
                      </div>
                    </div>
                    <div className="payment-card__body">
                      <div className="payment-method-item active" style={{ cursor: "default" }}>
                        <div className="payment-method-radio active" />
                        <div className="payment-method-icon">
                          <i className="bi bi-cash-stack" />
                        </div>
                        <div className="payment-method-info">
                          <div className="payment-method-label">Cash on Delivery</div>
                          <div className="payment-method-desc">Pay in cash when your order arrives</div>
                        </div>
                        <span className="payment-method-badge">Selected</span>
                      </div>

                      <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 14px",
                        background: "rgba(255,184,0,0.08)",
                        border: "1px solid rgba(255,184,0,0.2)",
                        borderRadius: "var(--radius-md)",
                        marginTop: 12,
                        fontSize: "0.83rem",
                        color: "var(--accent)",
                      }}>
                        <i className="bi bi-info-circle" style={{ flexShrink: 0 }} />
                        Keep ₹{totals.total} ready in cash. Our delivery partner will collect it.
                      </div>
                    </div>
                  </div>

                  {/* Confirm button */}
                  <button
                    className="btn btn-primary btn-block btn-lg"
                    onClick={handleConfirmOrder}
                    disabled={loading}
                  >
                    <i className="bi bi-bag-check" /> Confirm Order — ₹{totals.total}
                  </button>

                  <div className="payment-secure-note" style={{ marginTop: 14 }}>
                    <i className="bi bi-shield-check" />
                    Your order is safe and will be delivered in 30–40 min
                  </div>
                </motion.div>
              )}

              {/* ── Processing ── */}
              {step === "processing" && (
                <motion.div key="processing" className="payment-processing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="payment-processing__spinner">
                    <div className="payment-spinner-ring" />
                    <i className="bi bi-bag-fill payment-spinner-icon" />
                  </div>
                  <h3>Placing your order…</h3>
                  <p>Just a moment please</p>
                </motion.div>
              )}

              {/* ── Success ── */}
              {step === "success" && (
                <motion.div key="success" className="payment-result payment-result--success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>

                  <motion.div className="payment-result__icon"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                    <i className="bi bi-check-circle-fill" />
                  </motion.div>

                  <h2>Order Placed! 🎉</h2>
                  <p>
                    Your order will be delivered to <strong>{address.address}, {address.city}</strong>
                    {" "}in <strong>30–40 minutes</strong>.
                  </p>

                  <div className="payment-cod-note">
                    <i className="bi bi-cash-coin" />
                    Keep <strong>₹{totals.total}</strong> ready to pay the delivery partner in cash.
                  </div>

                  <div className="payment-result__actions" style={{ marginTop: 28 }}>
                    <button className="btn btn-primary btn-lg btn-pill"
                      onClick={() => { dispatch(resetPayment()); navigate("/orders"); }}>
                      <i className="bi bi-bag-check" /> Track My Order
                    </button>
                    <button className="btn btn-ghost btn-lg btn-pill"
                      onClick={() => { dispatch(resetPayment()); navigate("/home"); }}>
                      Back to Home
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Order summary sidebar ── */}
          {step !== "success" && (
            <div className="payment-summary">
              <div className="payment-card">
                <div className="payment-card__header">
                  <div className="payment-card__title">
                    <i className="bi bi-receipt" /> Order Summary
                  </div>
                </div>
                <div className="payment-card__body">

                  {/* Items */}
                  <div className="payment-summary__items">
                    {items.map((item) => (
                      <div key={item._id || item.id} className="payment-summary__item">
                        <div className="payment-summary__item-img">
                          <img src={item.image} alt={item.name} />
                          <span className="payment-summary__item-qty">{item.quantity}</span>
                        </div>
                        <div className="payment-summary__item-info">
                          <div className="payment-summary__item-name">{item.name}</div>
                          <div className="payment-summary__item-price">₹{item.price} each</div>
                        </div>
                        <div className="payment-summary__item-total">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="payment-summary__divider" />

                  {/* Bill breakdown */}
                  {[
                    { label: "Subtotal",  val: `₹${totals.subtotal}` },
                    totals.discountAmount > 0
                      ? { label: `Discount (${discountPercentage}%)`, val: `−₹${totals.discountAmount}`, green: true }
                      : null,
                    { label: "GST (5%)", val: `₹${totals.gst}` },
                    { label: "Delivery", val: `₹${totals.delivery}` },
                    { label: "Handling", val: `₹${totals.handling}` },
                  ].filter(Boolean).map(({ label, val, green }) => (
                    <div key={label} className="payment-bill-row">
                      <span>{label}</span>
                      <span style={{ color: green ? "var(--green)" : undefined }}>{val}</span>
                    </div>
                  ))}

                  <div className="payment-summary__divider" />

                  <div className="payment-bill-row payment-bill-total">
                    <span>Total (Cash)</span>
                    <span>₹{totals.total}</span>
                  </div>

                  <div className="payment-delivery-info">
                    <i className="bi bi-lightning-charge-fill" />
                    <span>Estimated delivery: <strong>30–40 min</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}