// Orders.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllOrders } from "./cartSlice";
import 'bootstrap/dist/css/bootstrap.min.css';

function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading) return <h2 className="text-center my-5">Loading Orders...</h2>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        <div className="row g-4">
          {orders.map((order, index) => (
            <div key={order._id || index} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order #{index + 1}</h5>
                  <small>{new Date(order.createdAt).toLocaleString()}</small>
                </div>

                <div className="card-body">
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  <p><strong>Total Amount:</strong> ₹{order.finalTotal.toFixed(2)}</p>

                  <h6 className="mt-3">Items:</h6>
                  <ul className="list-group list-group-flush">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        {item.name} × {item.quantity}
                        <span>₹{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-footer text-end">
                  <span className="badge bg-success">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
