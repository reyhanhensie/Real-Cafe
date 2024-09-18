import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./apiconfig"; // Import the API_URL

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

const MenuEditor = () => {
  const [menu, setMenu] = useState({});
  const [isEditing, setIsEditing] = useState(null); // Track which item is being edited
  const [categories] = useState(Object.keys(categoryMap));
  const [selectedCategory, setSelectedCategory] = useState("Makanan"); // Default to Makanan

  useEffect(() => {
    // Fetch the menu data
    axios
      .get(`${API_URL}/Menu`)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEdit = (category, id) => {
    setIsEditing({ category, id });
  };

  const handleSave = (category, id, updatedItem) => {
    // Make API request to save the updated item
    axios
      .put(`${API_URL}/${category}/${id}`, updatedItem)
      .then((response) => {
        // Update state with the modified item
        setMenu((prevMenu) => ({
          ...prevMenu,
          [category]: prevMenu[category].map((item) =>
            item.id === id ? response.data : item
          ),
        }));
        setIsEditing(null);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (category, id, field, value) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [category]: prevMenu[category].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div>
      {/* Navbar for category selection */}
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

      {/* Display menu items of the selected category */}
      {menu[selectedCategory] && (
        <div>
          <h2>{selectedCategory}</h2>
          <ul>
            {menu[selectedCategory].map((item) => (
              <li key={item.id}>
                {isEditing &&
                isEditing.category === selectedCategory &&
                isEditing.id === item.id ? (
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleChange(
                          selectedCategory,
                          item.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleChange(
                          selectedCategory,
                          item.id,
                          "price",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleChange(
                          selectedCategory,
                          item.id,
                          "qty",
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() => handleSave(selectedCategory, item.id, item)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <span>
                      {item.name} - {item.price} - {item.qty}
                    </span>
                    <button
                      onClick={() => handleEdit(selectedCategory, item.id)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
