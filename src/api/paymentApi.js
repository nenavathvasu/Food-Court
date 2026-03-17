// src/api/paymentApi.js
import api from "./axiosInstance";

/*  POST /api/v1/payment/create-order
    Body: { amount, customerEmail }
    Returns: { orderId, amount, currency, keyId }
*/
export const createRazorpayOrder = (amount, customerEmail) =>
  api.post("/payment/create-order", { amount, customerEmail }).then(r => r.data);

/*  POST /api/v1/payment/verify
    Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
*/
export const verifyRazorpayPayment = (payload) =>
  api.post("/payment/verify", payload).then(r => r.data);

/*
  ✅ loadRazorpayScript — injects the Razorpay checkout JS if not already loaded
  Call this once before opening the payment modal
*/
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script    = document.createElement("script");
    script.id       = "razorpay-script";
    script.src      = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload   = () => resolve(true);
    script.onerror  = () => resolve(false);
    document.body.appendChild(script);
  });

/*
  ✅ openRazorpayCheckout
  Usage:
    const result = await openRazorpayCheckout({
      amount:        finalTotal,        // in rupees
      customerEmail: user.email,
      customerName:  user.name,
      customerPhone: user.phone || "",
      onSuccess: (paymentData) => { ... },
      onFailure: (error)       => { ... },
    });
*/
export const openRazorpayCheckout = async ({
  amount,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onFailure,
}) => {
  try {
    // Step 1 — load the script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onFailure?.("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // Step 2 — create order on your backend
    const order = await createRazorpayOrder(amount, customerEmail);
    /*
      order = { orderId, amount (paise), currency, keyId }
      ✅ FIX: backend returns `keyId` — use it directly here
      If keyId is undefined → backend .env is missing RAZORPAY_KEY_ID
    */
    if (!order.keyId) {
      console.error("❌ keyId missing from backend response:", order);
      onFailure?.("Payment configuration error. Please contact support.");
      return;
    }

    // Step 3 — open Razorpay modal
    const options = {
      key:      order.keyId,           // ✅ from backend — never hardcode
      amount:   order.amount,          // in paise (backend already converted)
      currency: order.currency || "INR",
      order_id: order.orderId,
      name:     "Food Court",
      description: "Order Payment",
      prefill: {
        name:    customerName  || "",
        email:   customerEmail || "",
        contact: customerPhone || "",
      },
      theme: { color: "#ff6b35" },
      handler: async (response) => {
        /*
          response = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          }
        */
        try {
          // Step 4 — verify signature on your backend
          const verification = await verifyRazorpayPayment({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });

          if (verification.success) {
            onSuccess?.({
              paymentId: response.razorpay_payment_id,
              orderId:   response.razorpay_order_id,
            });
          } else {
            onFailure?.("Payment verification failed. Please contact support.");
          }
        } catch (err) {
          onFailure?.(err?.response?.data?.message || "Verification error");
        }
      },
      modal: {
        ondismiss: () => onFailure?.("Payment cancelled by user"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment error:", err);
    onFailure?.(err?.response?.data?.message || err.message || "Payment failed");
  }
};