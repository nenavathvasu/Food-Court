import React from "react";
import CouponApply from "./CouponApply";

const Coupon = () => {
  // You can list all available coupons here for reference
  const availableCoupons = [
    { code: "WELCOME10", desc: "Get 10% off on first order" },
    { code: "NEWYEAR20", desc: "20% off this New Year" },
    { code: "FESTIVE30", desc: "Festive 30% off" },
  ];

  return (
    <div className="mb-3">
      <h5>Available Coupons</h5>
      <ul>
        {availableCoupons.map((c) => (
          <li key={c.code}>
            <strong>{c.code}</strong> - {c.desc}
          </li>
        ))}
      </ul>

      <CouponApply />
    </div>
  );
};

export default Coupon;
