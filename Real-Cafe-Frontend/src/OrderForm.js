import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderForm.css'; // Import custom styling

const OrderForm = () => {
  const [categories, setCategories] = useState([
    'Camilan', 'Coffe', 'Jus', 'Lalapan', 'Makanan', 'Milkshake', 'MinumanDingin', 'MinumanPanas'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Makanan');
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [mejaNo, setMejaNo] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/${selectedCategory}`);
        setMenuItems(response.data);
      } catch (err) {
        setError('Error fetching menu items');
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const handleAddItem = (id, price) => {
    setOrderItems([...orderItems, { id, qty: 1, price }]);
    calculateTotalPrice([...orderItems, { id, qty: 1, price }]);
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
      setError('Meja No is required');
      return;
    }
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/order', {
        meja_no: mejaNo,
        items: orderItems,
      });
      navigate(`/order-summary?id=${response.data.id}`);
    } catch (err) {
      setError('Error placing the order');
    }
  };

  return (
    <div className="order-form">
      <div className="menu-container">
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

        <div className="menu-section">
          <h3>{selectedCategory} Menu</h3>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className="menu-item">
                <span>{item.name} - Rp. {item.price}</span>
                <button onClick={() => handleAddItem(item.id, item.price)}>Add</button>
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
              Item ID: {item.id} - Qty:
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
        <input
          type="text"
          value={mejaNo}
          onChange={(e) => setMejaNo(e.target.value)}
          placeholder="Meja No"
        />
        <h3>Total Price: Rp. {totalPrice}</h3>
        <button onClick={handleSubmit}>Place Order</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default OrderForm;
