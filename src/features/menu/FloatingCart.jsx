import React from "react";
import { useSelector } from "react-redux";
import "./FloatingCart.css";

const FloatingCart = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div className="floating-cart">
      <h5>🛒 Cart</h5>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
      <h6>Total: ₹{total}</h6>
    </div>
  );
};

export default FloatingCart;
