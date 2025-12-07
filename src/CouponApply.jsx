import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import coupons from "./Coupon";  // coupon list
import {
    setDiscount,
    selectCartSubtotal,
    selectFinalTotal
} from "./cartSlice";   // FIXED: Import from cartSlice

const CouponApplyCode = () => {

    const dispatch = useDispatch();

    const subtotal = useSelector(selectCartSubtotal);
    const finalTotal = useSelector(selectFinalTotal);
    const currentDiscount = useSelector((state) => state.cart.discountPercentage);

    const [couponCode, setCouponCode] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (couponCode.trim() === "") {
            dispatch(setDiscount(0));
            setFeedback("");
            return;
        }

        const timeout = setTimeout(() => {
            const code = couponCode.toUpperCase();

            if (coupons[code]) {
                dispatch(setDiscount(coupons[code]));
                setFeedback(`Success! '${code}' applied. Discount: ${coupons[code]}%`);
            } else {
                dispatch(setDiscount(0));
                setFeedback(`Invalid coupon code '${couponCode}'`);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [couponCode, dispatch]);

    // NEW: quick discount apply handler
    const applyQuickDiscount = (percent) => {
        dispatch(setDiscount(percent));
        setFeedback(`Applied flat ${percent}% discount`);
        // keep couponCode input intact (so user can still type)
    };

    return (
        <div style={{ border: "1px solid gray", padding: "20px", borderRadius: "8px", width: "350px" }}>
            
            <h2>Apply Coupon</h2>

            <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                style={{ padding: "8px", marginRight: "10px", width: "100%" }}
            />

            {feedback && (
                <p style={{ color: feedback.startsWith("Success") ? "green" : "red" }}>
                    {feedback}
                </p>
            )}

            <hr />

            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Discount: {currentDiscount}%</p>
            <p>Final Total: ₹{finalTotal.toFixed(2)}</p>

            {/* QUICK DISCOUNT BUTTONS (Option B: placed after discount amount) */}
            <div style={{ marginTop: "12px" }}>
                <h4 style={{ margin: "6px 0" }}>Quick Discounts</h4>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={() => applyQuickDiscount(10)}
                        style={{ padding: "8px 12px", cursor: "pointer" }}
                    >
                        10% OFF
                    </button>

                    <button
                        onClick={() => applyQuickDiscount(20)}
                        style={{ padding: "8px 12px", cursor: "pointer" }}
                    >
                        20% OFF
                    </button>

                    <button
                        onClick={() => applyQuickDiscount(30)}
                        style={{ padding: "8px 12px", cursor: "pointer" }}
                    >
                        30% OFF
                    </button>
                </div>
            </div>

        </div>
    );
};

export default CouponApplyCode;
