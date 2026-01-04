import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import { setDiscount } from "../features/cart/cartSlice";

const CouponApply = () => {
  const dispatch = useDispatch();
  const { discountPercentage } = useSelector((state) => state.cart);
  const [code, setCode] = useState("");

  // Example coupon list
  const coupons = {
    WELCOME10: 10,
    NEWYEAR20: 20,
    FESTIVE30: 30,
  };

  const handleApplyCoupon = () => {
    const discount = coupons[code.toUpperCase()];
    if (!discount) {
      Swal.fire("Invalid Coupon", "Please enter a valid coupon code", "error");
      return;
    }

    dispatch(setDiscount(discount));
    Swal.fire("Coupon Applied!", `You got ${discount}% off`, "success");
    setCode("");
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Apply Coupon</h5>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleApplyCoupon}>
          Apply
        </button>
      </div>
      {discountPercentage > 0 && (
        <p className="mt-2 text-success">
          Discount applied: {discountPercentage}%
        </p>
      )}
    </div>
  );
};

export default CouponApply;
