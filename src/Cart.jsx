import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  setDiscount,
  selectCartSubtotal,
  selectFinalTotal,
  placeOrder,
} from "./cartSlice";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';


function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectCartSubtotal);
  const finalTotal = useSelector(selectFinalTotal);
  const discountPercent = useSelector((state) => state.cart.discountPercentage);
  const user = useSelector((state) => state.auth.user);

  const [customerEmail, setCustomerEmail] = useState(user?.email || "");

  const discountedAmount = subtotal - (subtotal * discountPercent) / 100;
  const gst = discountedAmount * 0.12;

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please register or login before placing an order!");
      navigate("/register");
      return;
    }

    if (!customerEmail) {
      toast.warning("⚠️ Enter your email!");
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirm Order?",
      text: `Total Amount ₹${finalTotal}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Place Order",
    });

    if (!confirm.isConfirmed) return;

    const orderData = {
      customerEmail,
      items: cartItems,
      subtotal,
      discountPercent,
      discountedAmount,
      gst,
      finalTotal,
      createdAt: new Date().toISOString(),
    };

    const resultAction = await dispatch(placeOrder(orderData));

    if (placeOrder.fulfilled.match(resultAction)) {
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been placed successfully!",
      }).then(() => navigate("/Orders"));
    } else {
      toast.error("❌ Failed to place order");
    }
  };
  

  const paymentUPI = `upi://pay?pa=7075670630@ptyes&pn=Nenavath Vasu&am=${finalTotal}&cu=INR`;

  return (
    <div className="container my-5 d-flex flex-column align-items-center">
      <h2 className="text-center mb-4 animate__animated animate__fadeInDown">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center fs-5">Your cart is empty.</p>
      ) : (
        <>
          <div className="row justify-content-center g-4 w-100">
            {cartItems.map((item, index) => {
              const id = item.id || item._id;
              const colors = ["#ffe6e6", "#e6f7ff", "#e6ffe6", "#fff0e6"];
              return (
                <div key={id} className="col-md-6 d-flex justify-content-center">
                  <div
                    className="card shadow-sm p-3 cart-card animate__animated animate__fadeInUp"
                    style={{
                      background: colors[index % colors.length],
                      borderRadius: '1rem',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      width: '100%',
                      maxWidth: '400px'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="fw-bold">{item.name}</h5>
                        <p className="mb-1">Price: ₹{item.price}</p>
                        <span className="badge bg-info text-dark">{item.quantity} pcs</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary cart-btn"
                          onClick={() => dispatch(incrementQuantity(id))}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary cart-btn"
                          onClick={() => dispatch(decrementQuantity(id))}
                        >
                          -
                        </button>
                        <button
                          className="btn btn-sm btn-danger cart-btn"
                          onClick={() => dispatch(removeFromCart(id))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-4 p-4 rounded shadow-sm animate__animated animate__fadeIn w-100" style={{ backgroundColor: '#f8f9fa', maxWidth: '500px' }}>
            <div className="text-center">
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Discount:</span>
                <span>{discountPercent}%</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>GST 12%:</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                <button className="btn btn-warning btn-sm cart-btn" onClick={() => dispatch(setDiscount(10))}>10% OFF</button>
                <button className="btn btn-warning btn-sm cart-btn" onClick={() => dispatch(setDiscount(20))}>20% OFF</button>
                <button className="btn btn-warning btn-sm cart-btn" onClick={() => dispatch(setDiscount(30))}>30% OFF</button>
              </div>
              <h4 className="fw-bold mt-3">Final Total: ₹{finalTotal.toFixed(2)}</h4>
            </div>
          </div>

          {/* Email + Checkout */}
          <div className="mt-4 animate__animated animate__fadeInUp w-100" style={{ maxWidth: '500px' }}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              disabled={!!user?.email} // Disable if user already registered
            />

            <button className="btn btn-success w-100 mb-3 cart-btn" onClick={handleCheckout}>
              Checkout & Place Order
            </button>

            <div className="text-center">
              <h5>Scan to Pay</h5>
              <QRCodeSVG value={paymentUPI} size={180} level="H" className="animate__animated animate__zoomIn mb-2" />
              <p>Pay ₹{finalTotal.toFixed(2)}</p>
            </div>

            <button
              className="btn btn-primary w-100 mt-3 cart-btn"
              onClick={() => navigate("/Orders")}
            >
              View All Orders
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
