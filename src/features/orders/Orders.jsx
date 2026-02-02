import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllOrders } from "./orderSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const { list: orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!orders.length) return <div className="text-center mt-5">No Orders Yet 📦</div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">📦 My Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div key={order._id} className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5>Order ID: {order._id}</h5>
                <p className="text-muted">Customer: {order.customerEmail}</p>
                <p className="text-muted">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                <ul className="list-group list-group-flush mb-3">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      {item.name} x {item.qty}
                      <span>₹{item.total}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex flex-column gap-1">
                  <small>Subtotal: ₹{order.subtotal}</small>
                  <small>Discount ({order.discountPercent}%): -₹{order.discountedAmount}</small>
                  <small>GST (5%): ₹{order.gst}</small>
                  <small>Total: ₹{order.finalTotal}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
