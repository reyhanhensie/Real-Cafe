import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./OrderSummary.css";
import API_URL from "./apiconfig";
import notification from "./assets/sounds/notification_sound.wav";
import { format } from "date-fns";

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [strokedItems, setStrokedItems] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    orderId: null,
  });
  const [soundAlertDialog, setSoundAlertDialog] = useState({
    isOpen: true, // Show this on the first load
    enabled: false, // Orders and API will not be fetched until this is true
  });
  const audioRef = useRef(null);
  const previousOrdersCount = useRef(0);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [summary, setSummary] = useState({});
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);


  useEffect(() => {
    if (!soundAlertDialog.enabled) return;

    const handleUserInteraction = () => {
      if (soundAlertDialog.enabled) {
        setCanPlaySound(true); // Enable sound playback after user interaction
      }
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    // Add listeners to detect user interaction
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, [soundAlertDialog.enabled]);

  useEffect(() => {
    if (!soundAlertDialog.enabled) return; // Skip fetching if sound alerts aren't enabled

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/live-food`);
        setOrders(response.data);
        setSummary(categorizeItems(response.data));

        if (response.data.length > previousOrdersCount.current) {
          // Play sound for new order if enabled
          audioRef.current.play();
        }
        previousOrdersCount.current = response.data.length;
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders");
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [API_URL, soundAlertDialog.enabled]);

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
      await axios.patch(
        `${API_URL}/order/${confirmationDialog.orderId}/complete/food`
      );
      const response = await axios.get(`${API_URL}/live-food`);
      setOrders(response.data);

      previousOrdersCount.current = response.data.length;
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

  const enableSoundAlert = () => {
    setSoundAlertDialog({ isOpen: false, enabled: true });
  };

  const disableSoundAlert = () => {
    setSoundAlertDialog({ isOpen: false, enabled: false });
  };
  // SUMMARY OF THE COMPONENT
  const categorizeItems = (orders) => {
    const categories = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = formatCategory(item.item_type);

        if (!categories[category]) {
          categories[category] = {};
        }

        if (!categories[category][item.item_name]) {
          categories[category][item.item_name] = 0;
        }

        categories[category][item.item_name] += item.quantity;
      });
    });

    return categories;
  };

  const formatCategory = (type) => {
    const categoryMap = {
      lalapan: "Lalapan",
      makanan: "Makanan",
      minumandingin: "Minuman Dingin",
      minumanpanas: "Minuman Panas",
      jus: "Jus",
      milkshake: "Milkshake",
      coffe: "Kopi",
      camilan: "Camilan",
      paket: "Paket",
    };
    return categoryMap[type] || "Lainnya";
  };
  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  return (
    <div className="order-summary">
      {/* Only show the confirmation dialog if sound alerts are not yet enabled */}
      {soundAlertDialog.isOpen && (
        <div className="confirmation-dialog">
          <p>ENABLE SOUND ALERT FIRST!</p>
          <div className="confirmation-buttons">
            <button onClick={enableSoundAlert} className="confirm-button">
              OK
            </button>
          </div>
        </div>
      )}
      <div className="summary-container">
        <button className="toggle-button" onClick={handleToggleSummary}>
          {isSummaryVisible ? "X" : "☰"}
        </button>

        <div className={`summary-menu ${isSummaryVisible ? "show" : ""}`}>
          <h2>RINGKASAN</h2>
          {Object.entries(summary).map(([category, items]) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul>
                {Object.entries(items).map(([itemName, quantity]) => (
                  <li key={itemName}>
                    <span className="item-name">{itemName}</span>
                    <span className="item-quantity">{quantity}</span>
                  </li>

                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Render content only if sound alerts are enabled */}
      {!soundAlertDialog.isOpen && soundAlertDialog.enabled && (
        <>
          <audio ref={audioRef} src={notification} />
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
                  <div className="order-header">
                    <h3 className="order-time">
                      {format(new Date(order.created_at), "HH:mm:ss")}
                    </h3>
                    <h3>Meja: {order.meja_no}</h3>
                  </div>
                  <h3>Meja: {order.meja_no}</h3>
                  <h5>No Urut: {orders.indexOf(order) + 1}</h5>
                  <div className="List">
                    {Object.entries(groupItemsByType(order.items)).map(
                      ([type, items]) => (
                        <div key={type} className="order-category">
                          <h6>
                            {type === "minumanpanas"
                              ? "Minuman Panas"
                              : type === "minumandingin"
                                ? "Minuman Dingin"
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                          </h6>
                          <ul>
                            {items.map((item, index) => (
                              <li key={index} className="order-item">
                                <span
                                  className={`item-name ${(strokedItems[order.id] || []).includes(
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
                                <span className="item-qty">
                                  {item.quantity}
                                </span>
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
                <button onClick={cancelCompleteOrder} className="cancel-button">
                  Cancel
                </button>
                <button
                  onClick={confirmCompleteOrder}
                  className="confirm-button"
                >
                  Iya
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderSummary;
