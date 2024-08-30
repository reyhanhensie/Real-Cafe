import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderForm.css"; // Import custom styling

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
  };

  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState("Makanan");
  const [menuData, setMenuData] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [mejaNo, setMejaNo] = useState("");
  const [message, setMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/Menu`);
        setMenuData(response.data);
      } catch (err) {
        setError("Error fetching menu items");
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    setAddedItems(
      orderItems.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = new Set();
        acc[item.type].add(item.id);
        return acc;
      }, {})
    );
  }, [orderItems]);

  const handleAddItem = (id, name, price) => {
    const type = selectedCategory.toLowerCase().replace(/\s+/g, "");

    setOrderItems((prevOrderItems) => {
      const newItems = [...prevOrderItems, { type, id, name, qty: 1, price }];
      calculateTotalPrice(newItems);
      return newItems;
    });

    setAddedItems((prevAddedItems) => ({
      ...prevAddedItems,
      [type]: new Set([...(prevAddedItems[type] || []), id]),
    }));
  };

  const handleRemoveItem = (id, type) => {
    const newOrderItems = orderItems.filter(
      (item) => !(item.id === id && item.type === type)
    );
    setOrderItems(newOrderItems);
    calculateTotalPrice(newOrderItems);

    setAddedItems((prevAddedItems) => {
      const updatedCategoryItems = new Set(prevAddedItems[type] || []);
      updatedCategoryItems.delete(id);

      return {
        ...prevAddedItems,
        [type]: updatedCategoryItems,
      };
    });
  };

  const handleChangeQty = (index, qty) => {
    if (!qty || qty <= 0) {
      qty = 1;
    }
    const newOrderItems = [...orderItems];
    newOrderItems[index].qty = qty;
    setOrderItems(newOrderItems);
    calculateTotalPrice(newOrderItems);
    setError(null); // Clear the error if the quantity is valid
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  const handleSubmit = async () => {
    const mejaNoNumber = parseInt(mejaNo, 10);
    if (isNaN(mejaNoNumber)) {
      setError("Meja No must be a valid number");
      return;
    }

    try {
      const formattedItems = orderItems.map((item) => ({
        type: item.type,
        id: item.id,
        qty: item.qty,
      }));

      if (formattedItems.length === 0) {
        setError("ERROR: Minimal 1 Pesanan");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/send-order",
        {
          meja: mejaNoNumber,
          message: message,
          items: formattedItems,
        }
      );

      alert(`Order placed successfully! Order ID: ${response.data.id}`);
      setOrderItems([]);
      setTotalPrice(0);
      setMejaNo("");
      setMessage(""); // Clear the message after submission
      setAddedItems({});
    } catch (err) {
      setError("Error, Stock Habis");
    }
  };

  return (
    <div className="order-form">
      <div className="menu-container">
        <div className="nav-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-button ${
                selectedCategory === category ? "active" : ""
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
            {menuData[selectedCategory]?.map((item) => (
              <li key={item.id} className="menu-item">
                <span className="item-stock">{item.qty || "Habis"}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">Rp. {item.price}</span>
                {!addedItems[
                  selectedCategory.toLowerCase().replace(/\s+/g, "")
                ]?.has(item.id) ? (
                  <button
                    className="item-add"
                    onClick={() =>
                      handleAddItem(item.id, item.name, item.price)
                    }
                  >
                    <img
                      src="/icons/plus-solid.svg"
                      alt="Add Icon"
                      className="add-icon"
                    />
                  </button>
                ) : (
                  <span className="item-add-placeholder"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-summary">
        <h3>Your Order</h3>
        <ul>
          {orderItems.map((item, index) => (
            <li key={index} className="order-item">
              <span className="order-name">{item.name}</span>
              <span className="order-qty-container">
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(index, item.qty - 1)}
                >
                  -
                </button>
                <input
                  className="order-qty-input"
                  type="number"
                  value={item.qty}
                  min="1"
                  onChange={(e) =>
                    handleChangeQty(index, parseInt(e.target.value, 10))
                  }
                />
                <button
                  className="order-qty-button"
                  onClick={() => handleChangeQty(index, item.qty + 1)}
                >
                  +
                </button>
              </span>
            
              <span className="order-price">
              - Rp. {item.price * item.qty} </span>
              <button className="order-remove" onClick={() => handleRemoveItem(item.id, item.type)}>X</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={mejaNo}
          onChange={(e) => setMejaNo(e.target.value)}
          placeholder="Meja No"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows="3" // Set the textarea to have 3 rows
          className="message-input" // Apply the class here
        />
        <h3>Total Price: Rp. {totalPrice}</h3>
        <button onClick={handleSubmit}>Place Order</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default OrderForm;
