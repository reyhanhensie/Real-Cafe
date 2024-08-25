import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css'; // Import custom styling

const OrderForm = () => {
  // Mapping for display names to API keys
  const categoryMap = {
    'Camilan': 'Camilan',
    'Coffe': 'Coffe',
    'Jus': 'Jus',
    'Lalapan': 'Lalapan',
    'Makanan': 'Makanan',
    'Milkshake': 'Milkshake',
    'Minuman Dingin': 'MinumanDingin',
    'Minuman Panas': 'MinumanPanas',
  };

  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState('Makanan');
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [addedItems, setAddedItems] = useState({}); // Track added items by category
  const [mejaNo, setMejaNo] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const apiCategory = categoryMap[selectedCategory]; // Use API key
        const response = await axios.get(`http://127.0.0.1:8000/api/${apiCategory}`);
        setMenuItems(response.data);
      } catch (err) {
        setError('Error fetching menu items');
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  useEffect(() => {
    // Update addedItems when orderItems change
    setAddedItems(orderItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = new Set();
      acc[item.type].add(item.id);
      return acc;
    }, {}));
  }, [orderItems]);

  const handleAddItem = (id, name, price) => {
    const type = selectedCategory
      .toLowerCase()
      .replace(/\s+/g, ''); // Convert to lower case and remove spaces
    
    setOrderItems(prevOrderItems => {
      const newItems = [...prevOrderItems, { type, id, name, qty: 1, price }];
      calculateTotalPrice(newItems);
      return newItems;
    });

    setAddedItems(prevAddedItems => ({
      ...prevAddedItems,
      [selectedCategory]: new Set([...(prevAddedItems[selectedCategory] || []), id])
    }));
  };

  const handleRemoveItem = (id, type) => {
    const newOrderItems = orderItems.filter(item => !(item.id === id && item.type === type));
    setOrderItems(newOrderItems);
    calculateTotalPrice(newOrderItems);
  
    // Update addedItems for the current category
    setAddedItems(prevAddedItems => {
      const updatedCategoryItems = new Set(prevAddedItems[selectedCategory] || []);
      updatedCategoryItems.delete(id);
  
      return {
        ...prevAddedItems,
        [selectedCategory]: updatedCategoryItems
      };
    });
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
    const mejaNoNumber = parseInt(mejaNo, 10);
    if (isNaN(mejaNoNumber)) {
      setError('Meja No must be a valid number');
      return;
    }

    try {
      const formattedItems = orderItems.map(item => ({
        type: item.type,
        id: item.id,
        qty: item.qty,
      }));

      console.log('Sending data to /send-order:', formattedItems);
      const response = await axios.post('http://127.0.0.1:8000/api/send-order', {
        meja: mejaNoNumber,
        items: formattedItems,
      });
      alert(`Order placed successfully! Order ID: ${response.data.id}`);
      setOrderItems([]);
      setTotalPrice(0);
      setMejaNo('');
      setAddedItems({}); // Reset added items for all categories
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
                {!addedItems[selectedCategory]?.has(item.id) && (
                  <button onClick={() => handleAddItem(item.id, item.name, item.price)}>Add</button>
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
    {item.name} - Qty:
    <input
      type="number"
      value={item.qty}
      min="1"
      onChange={(e) => handleChangeQty(index, parseInt(e.target.value, 10))}
    />
    - Rp. {item.price * item.qty}
    <button onClick={() => handleRemoveItem(item.id, item.type)}>X</button>
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
