import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../cart/cartSlice";


function Orders() {
  const dispatch = useDispatch();
  const { allOrders, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading) return <h3 className="text-center">Loading...</h3>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Orders</h2>

      {allOrders.length === 0 ? (
        <p className="text-center">No orders found</p>
      ) : (
        allOrders.map((order, i) => (
          <div key={i} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>Order #{i + 1}</h5>
              <p>Email: {order.customerEmail}</p>
              <p>Total: ₹{order.finalTotal}</p>
              <p>Items:</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.qty} = ₹{item.total}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
