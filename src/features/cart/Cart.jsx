import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  setDiscount,
  clearCart,
  placeOrder,
} from "./cartSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Coupon from "../../components/Coupon";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, discountPercentage, loading } = useSelector(
    (state) => state.cart
  );

  // ✅ FIXED: Correct subtotal calculation
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercentage) / 100;
  const gst = (subtotal - discountAmount) * 0.12;
  const finalTotal = Number((subtotal - discountAmount + gst).toFixed(2));

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Swal.fire("Cart is empty", "Add items before checkout", "info");
      return;
    }

    const backendItems = items.map((i) => ({
      id: Number(i.id || i._id),
      name: i.name,
      price: i.price,
      qty: i.quantity,
      total: i.price * i.quantity,
    }));

    try {
      await dispatch(
        placeOrder({
          customerEmail: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).email
            : "guest@example.com",
          items: backendItems,
          subtotal,
          discountPercent: discountPercentage,
          discountedAmount: discountAmount,
          gst,
          finalTotal,
        })
      ).unwrap();

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: `Total: ₹${finalTotal}`,
        timer: 2000,
        showConfirmButton: false,
      });

      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      Swal.fire("Error", err || "Failed to place order", "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center my-5">
        <h3>Your cart is empty 😔</h3>
        <button className="btn btn-success" onClick={() => navigate("/veg")}>
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Cart</h2>

      <Coupon />

      {items.map((item) => (
        <div key={item._id || item.id} className="card p-3 mb-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{item.name}</strong>
              <p>
                ₹{item.price} × {item.quantity} = ₹
                {item.price * item.quantity}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() =>
                  dispatch(decrementQuantity(item._id || item.id))
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() =>
                  dispatch(incrementQuantity(item._id || item.id))
                }
              >
                +
              </button>
              <button
                className="btn btn-sm btn-danger ms-3"
                onClick={() =>
                  dispatch(removeFromCart(item._id || item.id))
                }
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mb-3">
        <label>Discount (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          className="form-control w-25"
          value={discountPercentage}
          onChange={(e) =>
            dispatch(setDiscount(Number(e.target.value)))
          }
        />
      </div>

      <div className="card p-3 mb-3">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Discount: {discountPercentage}%</p>
        <p>GST (12%): ₹{gst.toFixed(2)}</p>
        <h4>Total: ₹{finalTotal}</h4>
      </div>

      <button
        className="btn btn-success w-100"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? "Placing Order..." : `Place Order ₹${finalTotal}`}
      </button>
    </div>
  );
}

export default CartPage;
