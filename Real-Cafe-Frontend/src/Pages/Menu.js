import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '../components/MenuItem';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/menu');
        setMenuItems(response.data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      <div className="menu-items">
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
