import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderSummary.css"; // Import custom styling
import API_URL from "./apiconfig"; // Import the API_URL

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [strokedItems, setStrokedItems] = useState({}); // Track stroked items by order_id and item_name
  // const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL:", API_URL); // This should log the correct URL
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/live-orders`);
        setOrders(response.data);
        console.log(API_URL);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders");
      }
    };

    fetchOrders(); // Fetch orders on initial render

    const intervalId = setInterval(() => {
      // Fetch orders every 30 seconds
      fetchOrders();
    }, 30000); // 30,000 milliseconds = 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [API_URL]);

  const groupItemsByType = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.item_type]) {
        acc[item.item_type] = [];
      }
      acc[item.item_type].push(item);
      return acc;
    }, {});
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.patch(`${API_URL}/order/${orderId}/complete`);
      // Refresh orders list after marking as completed
      const response = await axios.get(`${API_URL}/live-orders`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error completing the order:", err);
      setError("Error completing the order");
    }
  };

  const handleItemClick = (orderId, itemName) => {
    setStrokedItems((prevStrokedItems) => {
      const orderStrokedItems = prevStrokedItems[orderId] || [];
      return {
        ...prevStrokedItems,
        [orderId]: orderStrokedItems.includes(itemName)
          ? orderStrokedItems.filter((name) => name !== itemName) // Remove stroke if already stroked
          : [...orderStrokedItems, itemName], // Add stroke if not already stroked
      };
    });
  };

  return (
    <div className="order-summary">
      <h2>ORDERS</h2>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Meja: {order.meja_no}</h3>
            <h5>No Urut: {orders.indexOf(order) + 1}</h5>{" "}
            {/* Display order number */}
            <div className="List">
              {Object.entries(groupItemsByType(order.items)).map(
                ([type, items]) => (
                  <div key={type} className="order-category">
                    <h6>{type.charAt(0).toUpperCase() + type.slice(1)}</h6>
                    <ul>
                      {items.map((item, index) => (
                        <li key={index} className="order-item">
                          <span
                            className={`item-name ${
                              (strokedItems[order.id] || []).includes(
                                item.item_name
                              )
                                ? "stroked"
                                : ""
                            }`}
                            onClick={() =>
                              handleItemClick(order.id, item.item_name)
                            }
                          >
                            {item.item_name}
                          </span>
                          <span className="item-qty">{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            {order.message && (
              <div className="order-message">
                <strong>Catatan:</strong>
                <p>{order.message}</p>
              </div>
            )}
            <div className="order-mark">
              <button
                className="Pesanan-button"
                onClick={() => handleCompleteOrder(order.id)}
              >
                Pesanan Selesai
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
