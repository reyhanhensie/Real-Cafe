import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css"; // Import custom styling

const OrderForm = () => {
  const [categories, setCategories] = useState([
    'Camilan', 'Coffe', 'Jus', 'Lalapan', 'Makanan', 'Milkshake', 'MinumanDingin', 'MinumanPanas'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Camilan');
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [mejaNo, setMejaNo] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch menu items based on the selected category
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/${selectedCategory}`);
        setMenuItems(response.data);
      } catch (err) {
        setError("Error fetching menu items");
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const handleAddItem = (id, price) => {
    setOrderItems([...orderItems, { type: selectedCategory.toLowerCase(), id, qty: 1, price }]);
    calculateTotalPrice([...orderItems, { type: selectedCategory.toLowerCase(), id, qty: 1, price }]);
  };

  const handleChangeQty = (index, qty) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].qty = qty;
    setOrderItems(newOrderItems);
    calculateTotalPrice(newOrderItems);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotalPrice(total);
  };

  const handleSubmit = async () => {
    if (!mejaNo) {
      setError("Meja No is required");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/order", {
        meja_no: mejaNo,
        items: orderItems,
      });
      alert(`Order placed successfully! Order ID: ${response.data.id}`);
      setOrderItems([]); // Reset the order form
      setTotalPrice(0); // Reset the total price
      setMejaNo(""); // Reset Meja No
    } catch (err) {
      setError("Error placing the order");
    }
  };

  return (
    <div className="order-page">
      <div className="order-form">
        {/* Navigation for menu categories */}
        <div className="nav-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu and order summary sections */}
        <div className="content-container">
          <div className="menu-container">
            <h3>{selectedCategory} Menu</h3>
            {error && <p className="error-message">{error}</p>}
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <span>
                    {item.name} - Rp. {item.price}
                  </span>
                  <button
                    className="add-button"
                    onClick={() => handleAddItem(item.id, item.price)}
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-summary">
            <h3>Your Order</h3>
            <ul>
              {orderItems.map((item, index) => (
                <li key={index} className="order-item">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.id}{" "}
                  - Qty:
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) =>
                      handleChangeQty(index, parseInt(e.target.value, 10))
                    }
                  />
                  - Rp. {item.price * item.qty}
                </li>
              ))}
            </ul>

            <h3>Total Price: Rp. {totalPrice}</h3>
            <input
              type="text"
              placeholder="Meja No"
              value={mejaNo}
              onChange={(e) => setMejaNo(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmit}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
