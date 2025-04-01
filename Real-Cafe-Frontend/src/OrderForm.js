import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderForm.css";
import API_URL from "./apiconfig";

const OrderForm = () => {
  const categoryMap = {
    Camilan: "Camilan",
    Coffe: "Coffe",
    Jus: "Jus",
    Lalapan: "Lalapan",
    Makanan: "Makanan",
    Milkshake: "Milkshake",
    "Minuman Dingin": "Minuman Dingin",
    "Minuman Panas": "Minuman Panas",
    Paket: "Paket",
    Rokok: "Rokok"
  };

  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState("Makanan");
  const [menuData, setMenuData] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [mejaNo, setMejaNo] = useState("");
  const [Bayar, setBayar] = useState("");
  const [message, setMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [Kembalian, setKembalian] = useState(0);
  const [error, setError] = useState(null);
  const [SelectedCashier, setSelectedCashier] = useState("");
  const [loading, setLoading] = useState(false);
  const [cashierCode, setCashierCode] = useState("");

  // Cashier mapping
  const cashierMap = {
    61112: "Risma",
    "03072": "Ryan",
    55671: "Ferdi",
    33205: "Nanda",
    13084: "Putri",
    69696: "Reyhan",
  };

  // Fetch menu items on component mount
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/Menu`);
        setMenuData(response.data);
      } catch (err) {
        setError("Error fetching menu items");
      }
    };
    fetchMenuItems();
  }, []);

  // Calculate total price whenever order items change
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [orderItems]);

  // Calculate change whenever total price or payment amount changes
  useEffect(() => {
    const kembalian = Math.max(0, parseInt(Bayar || 0, 10) - totalPrice);
    setKembalian(kembalian);
  }, [totalPrice, Bayar]);

  // Handle adding items to order
  const handleAddItem = (id, name, price, maxQty) => {
    const type = selectedCategory.toLowerCase().replace(/\s+/g, "");

    setOrderItems(prevItems => {
      // Check if item already exists in order
      const existingItemIndex = prevItems.findIndex(
        item => item.id === id && item.type === type
      );

      if (existingItemIndex >= 0) {
        // If exists, increment quantity (up to max + 10)
        const newItems = [...prevItems];
        const existingItem = newItems[existingItemIndex];
        const newQty = Math.min(existingItem.quantity + 1, existingItem.maxQty + 10);
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQty
        };
        return newItems;
      } else {
        // If new, add with quantity 1
        const newItem = {
          type,
          id,
          name,
          price,
          maxQty,
          quantity: 1
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Handle quantity changes
  const handleChangeQty = (item, newQty) => {
    setOrderItems(prevItems => {
      return prevItems.map(prevItem => {
        if (prevItem.id === item.id && prevItem.type === item.type) {
          // Validate new quantity (between 1 and maxQty + 10)
          const validQty = Math.max(
            1,
            Math.min(item.maxQty + 10, parseInt(newQty, 10) || 1
            ));
          return { ...prevItem, quantity: validQty };
        }
        return prevItem;
      });
    });
  };

  // Handle removing items
  const handleRemoveItem = (id, type) => {
    setOrderItems(prevItems =>
      prevItems.filter(item => !(item.id === id && item.type === type))
    )
  };

  // Helper function to format prices
  const PriceFormat = (price) => {
    if (price == null) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle cashier code input
  const handleCashierCodeChange = (event) => {
    const code = event.target.value.replace(/[^0-9]/g, "");
    setCashierCode(code);
    setSelectedCashier(cashierMap[code] || "");
  };

  // Handle table number input
  const handleMejaNoChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    const numberValue = value
      ? Math.min(99, Math.max(1, parseInt(value, 10)))
      : "";
    setMejaNo(numberValue.toString());
  };

  // Handle payment amount input
  const handleBayar = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    const numberValue = value
      ? Math.min(10000000, Math.max(1, parseInt(value, 10)))
      : "";
    setBayar(numberValue.toString());
  };

  // Submit order to server
  const handleSubmit = async () => {
    const mejaNoNumber = parseInt(mejaNo, 10);

    if (!SelectedCashier) {
      setError("Masukkan Kode Kasir Terlebih Dahulu");
      return;
    }
    if (isNaN(mejaNoNumber)) {
      setError("Masukkan Nomor Meja Terlebih Dahulu!");
      return;
    }
    if (orderItems.length === 0) {
      setError("ERROR: Minimal 1 Pesanan");
      return;
    }
    if (parseInt(Bayar, 10) < totalPrice) {
      setError("Uang Kurang!");
      return;
    }

    setLoading(true);

    try {
      const formattedItems = orderItems.map(item => ({
        type: item.type,
        id: item.id,
        qty: item.quantity,
      }));

      const response = await axios.post(`${API_URL}/send-order`, {
        meja: mejaNoNumber,
        kasir: SelectedCashier,
        message: message,
        items: formattedItems,
        bayar: parseInt(Bayar, 10),
      });

      alert(`Pesanan Berhasil Dibuat!, ID Pesanan : ${response.data.id}`);

      // Reset form
      setOrderItems([]);
      setTotalPrice(0);
      setMejaNo("");
      setMessage("");
      setBayar("");
      setSelectedCashier("");
      setCashierCode("");
      setError(null);
    } catch (err) {
      setError("Error, Stock Habis");
    } finally {
      setLoading(false);
    }
  };

  // Check if order can be submitted
  const isMinimalOrder = orderItems.length > 0;
  const isMejaNoValid = mejaNo.trim() !== "";
  const isKasirValid = SelectedCashier !== "";
  const isBayarValid = parseInt(Bayar || 0, 10) >= totalPrice;

  return (
    <div className="order-form">
      <div className="menu-container">
        <div className="nav-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-button ${selectedCategory === category ? "active" : ""
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-section">
          <h3>{selectedCategory} Menu</h3>
          <ul>
            <li className="menu-header">
              <span className="header-stock">STOCK</span>
              <span className="header-name">NAMA</span>
              <span className="header-price">HARGA</span>
              <span className="header-add">TAMBAH</span>
            </li>
            {menuData[selectedCategory]?.map((item) => {
              const isInOrder = orderItems.some(
                orderItem => orderItem.id === item.id &&
                  orderItem.type === selectedCategory.toLowerCase().replace(/\s+/g, "")
              );

              return (
                <li key={item.id} className="menu-item">
                  <span className={`item-stock ${item.qty === 0 ? "out-of-stock" : ""}`}>
                    {item.qty || "Habis"}
                  </span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">Rp. {PriceFormat(item.price)}</span>
                  {!isInOrder ? (
                    <button
                      className="item-add"
                      onClick={() => handleAddItem(item.id, item.name, item.price, item.qty)}
                      disabled={item.qty === 0}
                    >
                      <img
                        src={item.qty === 0 ? "/icons/ban.svg" : "/icons/plus-solid2.svg"}
                        alt="Add Icon"
                        className="add-icon"
                      />
                    </button>
                  ) : (
                    <button className="item-add-placeholder">
                      <img
                        src="/icons/checkmark.svg"
                        alt="Mark"
                        className="add-icon-placeholder"
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="order-summary">
        <div className="header">
          <div className="order-cashier">
            <h3 id="Your-Order">Your Order</h3>
            <h3 id="kasir">Kasir : {SelectedCashier || "Belum Dipilih"}</h3>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cashierCode}
              onChange={handleCashierCodeChange}
              placeholder="Kode Kasir"
            />
          </div>
        </div>

        <ul>
          {orderItems.map((item) => (
            <li key={`${item.type}-${item.id}`} className="order-item">
              <span className="order-name">{item.name}</span>
              <span className="order-qty-container">
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <img src="/icons/minus-small.svg" alt="-" />
                </button>
                <input
                  className={`order-qty-input ${item.quantity >= item.maxQty ? "max" : ""
                    }`}
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleChangeQty(item, e.target.value)}
                />
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(item, item.quantity + 1)}
                  disabled={item.quantity >= item.maxQty + 10}
                >
                  <img src="/icons/plus-small.svg" alt="+" />
                </button>
              </span>
              <span className="order-price">
                - Rp. {PriceFormat(item.price * item.quantity)}
              </span>
              <button
                className="order-remove"
                onClick={() => handleRemoveItem(item.id, item.type)}
              >
                <img src="/icons/x-circle.svg" alt="X" />
              </button>
            </li>
          ))}
        </ul>

        <div className="order-form-input">
          <div className="order-form-message">
            <h3>Catatan</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan Catatan Pesanan (OPSIONAL)"
              rows="3"
              className="message-input"
            />
          </div>

          <div className="order-form-meja">
            <h3>Nomor Meja :</h3>
            <input
              type="number"
              value={mejaNo}
              onChange={handleMejaNoChange}
              placeholder="Nomor"
              min="1"
              max="99"
            />
            {!isMejaNoValid && <h4>Masukkan Nomor Meja !</h4>}
          </div>

          <div className="order-form-bayar">
            <h3>Bayar :</h3>
            <input
              type="number"
              value={Bayar}
              onChange={handleBayar}
              placeholder="Rp. "
              min="0"
            />
            {!isBayarValid && <h4>Uang Kurang !</h4>}
          </div>

          <h3>Total Price: Rp. {PriceFormat(totalPrice)}</h3>
          <h3>Kembalian: Rp. {PriceFormat(Kembalian)}</h3>

          {isMejaNoValid && isMinimalOrder && isBayarValid && isKasirValid ? (
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Kirim Ke Dapur"}
            </button>
          ) : (
            <button disabled>Kirim Ke Dapur</button>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;