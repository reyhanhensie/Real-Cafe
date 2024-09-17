import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderSummary.css";
import API_URL from "./apiconfig";

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [strokedItems, setStrokedItems] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, orderId: null });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/live-orders`);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders");
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
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
    setConfirmationDialog({ isOpen: true, orderId });
  };

  const confirmCompleteOrder = async () => {
    try {
      await axios.patch(`${API_URL}/order/${confirmationDialog.orderId}/complete`);
      const response = await axios.get(`${API_URL}/live-orders`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error completing the order:", err);
      setError("Error completing the order");
    }
    setConfirmationDialog({ isOpen: false, orderId: null });
  };

  const cancelCompleteOrder = () => {
    setConfirmationDialog({ isOpen: false, orderId: null });
  };

  const handleItemClick = (orderId, itemName) => {
    setStrokedItems((prevStrokedItems) => {
      const orderStrokedItems = prevStrokedItems[orderId] || [];
      return {
        ...prevStrokedItems,
        [orderId]: orderStrokedItems.includes(itemName)
          ? orderStrokedItems.filter((name) => name !== itemName)
          : [...orderStrokedItems, itemName],
      };
    });
  };

  return (
    <div className="order-summary">
      <h2>ORDERS</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <div className="empty-order">
          <div className="empty-order-content">
            <i className="fas fa-clipboard-list empty-order-icon"></i>
            <h3>Tidak Ada Pesanan</h3>
            <p>Nyantai Dulu</p>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Meja: {order.meja_no}</h3>
              <h5>No Urut: {orders.indexOf(order) + 1}</h5>
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
      )}
      {confirmationDialog.isOpen && (
        <div className="confirmation-dialog">
          <p>Apakah anda yakin?</p>
          <div className="confirmation-buttons">
            <button onClick={cancelCompleteOrder} className="cancel-button">Cancel</button>
            <button onClick={confirmCompleteOrder} className="confirm-button">Iya</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;