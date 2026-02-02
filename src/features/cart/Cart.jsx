import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  placeOrder,
  resetOrderSuccess
} from "./cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, discountPercentage, loading, orderSuccess } = useSelector(
    (state) => state.cart
  );

  // redirect to orders page after order
  useEffect(() => {
    if (orderSuccess) {
      dispatch(resetOrderSuccess());
      navigate("/orders");
    }
  }, [orderSuccess, navigate, dispatch]);

  if (!items.length)
    return (
      <div className="text-center mt-5">
        <h2>Your Cart is Empty 🛒</h2>
        <p>Add delicious items to see them here!</p>
      </div>
    );

  // CALCULATE BILL
  const formattedItems = items.map((item) => ({
    id: Number(item.id || item._id),
    name: item.name,
    price: item.price,
    qty: item.quantity,
    total: item.price * item.quantity,
  }));

  const subtotal = formattedItems.reduce((sum, i) => sum + i.total, 0);
  const discountPercent = discountPercentage || 0;
  const discountedAmount = Math.round((subtotal * discountPercent) / 100);
  const gst = Math.round((subtotal - discountedAmount) * 0.05); // 5% GST
  const deliveryCharge = subtotal > 0 ? 25 : 0;
  const handlingCharge = subtotal > 0 ? 2 : 0;
  const smallCartCharge = subtotal > 0 && subtotal < 100 ? 20 : 0;
  const finalTotal =
    subtotal - discountedAmount + gst + deliveryCharge + handlingCharge + smallCartCharge;

  // PLACE ORDER
  const handlePlaceOrder = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      alert("Please login first");
      return;
    }

    const orderData = {
      customerEmail: user.email,
      items: formattedItems,
      subtotal,
      discountPercent,
      discountedAmount,
      gst,
      finalTotal,
    };

    dispatch(placeOrder(orderData));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🛒 Your Cart</h2>

      <div className="row">
        {/* CART ITEMS */}
        <div className="col-lg-8">
          {formattedItems.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm border-0 rounded-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.name}</h5>
                  <p className="text-muted mb-1">₹{item.price}</p>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => dispatch(decrementQuantity(item.id))}
                    >
                      −
                    </button>
                    <span className="btn btn-sm btn-light">{item.qty}</span>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => dispatch(incrementQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-end">
                  <h6>₹{item.total}</h6>
                  <button
                    className="btn btn-sm btn-outline-dark mt-2"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BILL SUMMARY */}
        <div className="col-lg-4">
          <div className="card shadow border-0 rounded-4 p-4">
            <h4 className="mb-3">Bill Details</h4>
            <p>Subtotal: ₹{subtotal}</p>
            <p>Discount ({discountPercent}%): -₹{discountedAmount}</p>
            <p>GST (5%): ₹{gst}</p>
            <p>Delivery: ₹{deliveryCharge}</p>
            <p>Handling: ₹{handlingCharge}</p>
            <p>Small Cart Fee: ₹{smallCartCharge}</p>
            <hr />
            <h5>Total: ₹{finalTotal}</h5>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <button
              className="btn btn-outline-danger w-100 mt-2"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
