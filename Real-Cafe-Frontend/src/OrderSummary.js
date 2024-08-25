import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderSummary.css'; // Import custom styling

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/orders'); // Adjust API endpoint as needed
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Order ID: {order.id}</h3>
            <p>Total Price: Rp. {order.total_price}</p>
            <p>Status: {order.status}</p>
            <p>Meja No: {order.meja_no}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.item_name} - Qty: {item.quantity} - Rp. {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
