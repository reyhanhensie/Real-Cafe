import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderSummary.css'; // Import custom styling

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const groupItemsByType = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.item_type]) {
        acc[item.item_type] = [];
      }
      acc[item.item_type].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="order-summary">
      <h2>Pesanan</h2>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Meja No: {order.meja_no}</h3>
            <h4>Status: {order.status}</h4>
            {Object.entries(groupItemsByType(order.items)).map(([type, items]) => (
              <div key={type} className="order-category">
                <h5>{type.charAt(0).toUpperCase() + type.slice(1)}</h5>
                <ul>
                  {items.map((item, index) => (
                    <li key={index} className="order-item">
                      <span className="item-name">{item.item_name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
