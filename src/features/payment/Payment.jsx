// src/features/payment/Payment.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { createRazorpayOrder, verifyPayment, resetPayment, setCodSuccess } from "./paymentSlice";
import { placeOrder, clearCart, selectCartTotals } from "../cart/cartSlice";
import "../../styles/pages.css";
import "../../pages/Payment.css";

// ── Load Razorpay script dynamically (outside component — never recreated) ──
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyHere";

const PAYMENT_METHODS = [
  { id: "upi",        label: "UPI",              icon: "bi-phone",              desc: "Google Pay, PhonePe, Paytm, BHIM" },
  { id: "card",       label: "Card",             icon: "bi-credit-card-2-front",desc: "Credit / Debit card" },
  { id: "netbanking", label: "Netbanking",        icon: "bi-bank",               desc: "All major Indian banks" },
  { id: "wallet",     label: "Wallets",           icon: "bi-wallet2",            desc: "Paytm, Mobikwik, Amazon Pay" },
  { id: "cod",        label: "Cash on Delivery",  icon: "bi-cash-stack",         desc: "Pay when your order arrives" },
];

// ── AddressForm lifted OUTSIDE Payment so React never remounts it on re-render ──
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
          Continue to Payment <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

// ── UPI input lifted OUTSIDE Payment so it never remounts when selectedMethod changes ──
function UpiInput({ value, onChange }) {
  return (
    <div className="payment-upi-input">
      <label style={{ fontSize: "0.8rem", color: "var(--text-2)", fontWeight: 600, marginBottom: 6, display: "block" }}>
        UPI ID <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional — Razorpay will ask)</span>
      </label>
      <div className="input-wrap">
        <i className="bi bi-at" />
        <input
          className="input"
          type="text"
          placeholder="yourname@upi"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

// ── Main Payment component ────────────────────────────────────
export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, discountPercentage } = useSelector((s) => s.cart);
  const totals                        = useSelector(selectCartTotals);
  const { user }                      = useSelector((s) => s.auth);
  const { loading, verifying, success, failed, error } = useSelector((s) => s.payment);

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId,          setUpiId]          = useState("");
  const [step,           setStep]           = useState("method");
  const [addressStep,    setAddressStep]    = useState(true);
  const [address,        setAddress]        = useState({
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

  // React to payment success / failure from Redux
  useEffect(() => {
    if (success) setStep("success");
    if (failed)  setStep("failed");
  }, [success, failed]);

  // Stable address field handler — does NOT cause remount
  const handleAddressChange = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressContinue = () => {
    if (!address.name.trim() || !address.phone.trim() || !address.address.trim()) {
      toast.error("Please fill in name, phone and address");
      return;
    }
    setAddressStep(false);
  };

  const formattedItems = items.map((i) => ({
    id:    Number(i._id || i.id),
    name:  i.name,
    price: i.price,
    qty:   i.quantity,
    total: i.price * i.quantity,
  }));

  const placeBackendOrder = (extraInfo = {}) => {
    dispatch(placeOrder({
      customerEmail:    user?.email,
      items:            formattedItems,
      subtotal:         totals.subtotal,
      discountPercent:  discountPercentage,
      discountedAmount: totals.discountAmount,
      gst:              totals.gst,
      finalTotal:       totals.total,
      paymentMethod:    selectedMethod,
      ...extraInfo,
    }));
  };

  // ── COD ──────────────────────────────────────────────────────
  const handleCOD = () => {
    setStep("processing");
    setTimeout(() => {
      dispatch(setCodSuccess());
      placeBackendOrder({ paymentMethod: "cod" });
      dispatch(clearCart());
      setStep("success");
    }, 1200);
  };

  // ── Razorpay ─────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    if (!user?.email) { toast.error("Please login first"); navigate("/login"); return; }
    setStep("processing");

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setStep("method");
      return;
    }

    let razorpayOrderId = null;
    try {
      const result = await dispatch(createRazorpayOrder(totals.total));
      razorpayOrderId = result.payload?.orderId;
    } catch (_) { /* demo mode */ }

    const options = {
      key:         RAZORPAY_KEY,
      amount:      totals.total * 100,
      currency:    "INR",
      name:        "FoodCourt",
      description: `Order of ${items.length} item${items.length !== 1 ? "s" : ""}`,
      image:       "https://via.placeholder.com/60x60/ff4444/ffffff?text=FC",
      order_id:    razorpayOrderId || undefined,
      prefill: {
        name:    user?.name  || address.name,
        email:   user?.email || "",
        contact: user?.phone || address.phone,
        vpa:     upiId || undefined,
      },
      theme:  { color: "#ff4444" },
      modal:  { ondismiss: () => { toast.info("Payment cancelled"); setStep("method"); } },
      handler: async (response) => {
        if (razorpayOrderId) {
          await dispatch(verifyPayment({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          }));
        }
        placeBackendOrder({ paymentId: response.razorpay_payment_id, paymentMethod: selectedMethod });
        dispatch(clearCart());
        dispatch(resetPayment());
        setStep("success");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      toast.error(`Payment failed: ${resp.error.description}`);
      setStep("failed");
    });
    rzp.open();
    setStep("method");
  };

  const handlePay = () => {
    if (selectedMethod === "cod") handleCOD();
    else handleOnlinePayment();
  };

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <div className="payment-page">
      <div className="container">

        {/* Progress bar */}
        <div className="payment-steps">
          {["Address", "Payment", "Confirmation"].map((label, i) => {
            const active = i === (addressStep ? 0 : step === "success" ? 2 : 1);
            const done   = !addressStep && i === 0;
            return (
              <React.Fragment key={label}>
                <div className={`payment-step${active ? " active" : ""}${done ? " done" : ""}`}>
                  <div className="payment-step__num">
                    {done ? <i className="bi bi-check2" /> : i + 1}
                  </div>
                  <span>{label}</span>
                </div>
                {i < 2 && <div className={`payment-step__line${done ? " done" : ""}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="payment-layout">
          <div className="payment-main">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Address ── */}
              {addressStep && (
                <motion.div key="addr"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <AddressForm
                    address={address}
                    onChange={handleAddressChange}
                    onContinue={handleAddressContinue}
                  />
                </motion.div>
              )}

              {/* ── Step 2: Payment method ── */}
              {!addressStep && step === "method" && (
                <motion.div key="method"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="payment-card">
                    <div className="payment-card__header">
                      <div className="payment-card__title">
                        <i className="bi bi-credit-card" /> Choose Payment Method
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setAddressStep(true)}>
                        <i className="bi bi-arrow-left" /> Back
                      </button>
                    </div>
                    <div className="payment-card__body">

                      {/* Method list */}
                      {PAYMENT_METHODS.map((m) => (
                        <div
                          key={m.id}
                          className={`payment-method-item${selectedMethod === m.id ? " active" : ""}`}
                          onClick={() => setSelectedMethod(m.id)}
                        >
                          <div className={`payment-method-radio${selectedMethod === m.id ? " active" : ""}`} />
                          <div className="payment-method-icon">
                            <i className={`bi ${m.icon}`} />
                          </div>
                          <div className="payment-method-info">
                            <div className="payment-method-label">{m.label}</div>
                            <div className="payment-method-desc">{m.desc}</div>
                          </div>
                          {selectedMethod === m.id && (
                            <span className="payment-method-badge">Selected</span>
                          )}
                        </div>
                      ))}

                      {/* UPI ID input — stable component, never remounts */}
                      {selectedMethod === "upi" && (
                        <UpiInput value={upiId} onChange={setUpiId} />
                      )}

                      <button
                        className="btn btn-primary btn-block btn-lg"
                        style={{ marginTop: 24 }}
                        onClick={handlePay}
                        disabled={loading || verifying}
                      >
                        {loading || verifying ? (
                          <><span className="spinner-border spinner-border-sm" /> Processing…</>
                        ) : selectedMethod === "cod" ? (
                          <><i className="bi bi-bag-check" /> Confirm Order — ₹{totals.total}</>
                        ) : (
                          <><i className="bi bi-lock-fill" /> Pay Securely ₹{totals.total}</>
                        )}
                      </button>

                      <div className="payment-secure-note">
                        <i className="bi bi-shield-check" />
                        100% secure payments powered by Razorpay
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Processing ── */}
              {step === "processing" && (
                <motion.div key="processing" className="payment-processing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="payment-processing__spinner">
                    <div className="payment-spinner-ring" />
                    <i className="bi bi-lock-fill payment-spinner-icon" />
                  </div>
                  <h3>Processing your payment…</h3>
                  <p>Please don't close this window</p>
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
                  <h2>Payment Successful! 🎉</h2>
                  <p>Your order has been placed and will be delivered in <strong>30–40 minutes</strong>.</p>
                  {selectedMethod === "cod" && (
                    <div className="payment-cod-note">
                      <i className="bi bi-cash-coin" /> Pay ₹{totals.total} in cash when your order arrives.
                    </div>
                  )}
                  <div className="payment-result__actions">
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

              {/* ── Failed ── */}
              {step === "failed" && (
                <motion.div key="failed" className="payment-result payment-result--failed"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="payment-result__icon">
                    <i className="bi bi-x-circle-fill" />
                  </div>
                  <h2>Payment Failed</h2>
                  <p>{error || "Something went wrong. Please try again."}</p>
                  <div className="payment-result__actions">
                    <button className="btn btn-primary btn-lg btn-pill"
                      onClick={() => { dispatch(resetPayment()); setStep("method"); }}>
                      <i className="bi bi-arrow-clockwise" /> Try Again
                    </button>
                    <button className="btn btn-ghost btn-lg btn-pill"
                      onClick={() => { dispatch(resetPayment()); navigate("/cart"); }}>
                      Back to Cart
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Order summary sidebar ── */}
          {step !== "success" && step !== "failed" && (
            <div className="payment-summary">
              <div className="payment-card">
                <div className="payment-card__header">
                  <div className="payment-card__title">
                    <i className="bi bi-receipt" /> Order Summary
                  </div>
                </div>
                <div className="payment-card__body">
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
                    <span>Total</span>
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