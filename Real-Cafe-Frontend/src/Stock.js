import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./apiconfig"; // Import the API_URL
import styles from "./Stock.module.css"; // Import the CSS Module

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
  const [form, setForm] = useState({ name: "", price: "", qty: "" });

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
    const item = menu[category].find((item) => item.id === id);
    setIsEditing({ category, id });
    setForm({ name: item.name, price: item.price, qty: item.qty });
  };

  const handleSave = (category, id) => {
    const sanitizedCategory = category.replace(/\s+/g, "");
    const updatedItem = { ...form }; // Prepare the updated item from the form data

    axios
      .put(`${API_URL}/${sanitizedCategory}/${id}`, updatedItem)
      .then((response) => {
        // Use the response data (updated item) to update the state
        const updatedData = response.data.data || updatedItem;
        console.log(`${API_URL}/${sanitizedCategory}/${id}`);
        console.log(form);
        console.log("API response:", response.data);

        // Update the state with the modified item
        setMenu((prevMenu) => ({
          ...prevMenu,
          [category]: prevMenu[category].map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
          ),
        }));

        // Reset the editing state
        setIsEditing(null);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleClose = () => {
    setIsEditing(null);
    setForm({ name: "", price: "", qty: "" });
  };
  const handleAddItem = () => {
    const sanitizedCategory = selectedCategory.replace(/\s+/g, "");
    const newItem = { ...form }; // Prepare the new item from the form data

    axios
      .post(`${API_URL}/${sanitizedCategory}`, newItem)
      .then((response) => {
        const addedItem = response.data.data || newItem;

        // Update the state with the new item
        setMenu((prevMenu) => ({
          ...prevMenu,
          [selectedCategory]: [...prevMenu[selectedCategory], addedItem],
        }));

        // Reset the form and close the modal
        handleClose();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={styles.stockContainer}>
      {/* Navbar for category selection */}
      <div className={styles.navBar}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.navButton} ${
              selectedCategory === category ? styles.navButtonActive : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display menu items of the selected category */}
      {menu[selectedCategory] && menu[selectedCategory].length > 0 ? (
        <div className={styles.stockList}>
          <h2>{selectedCategory}</h2>
          <table>
            <thead>
              <tr className={styles.itemstock}>
                <th className={styles.itemname}>Nama</th>
                <th className={styles.itemprice}>Harga</th>
                <th className={styles.itemqty}>Stock</th>
                <th className={styles.itemedit}>Ubah</th>
              </tr>
            </thead>
            <tbody>
              {menu[selectedCategory].map((item) => (
                <tr className={styles.itemstock} key={item.id}>
                  <td className={styles.itemname}>{item.name}</td>
                  <td className={styles.itemprice}>Rp. {item.price}</td>
                  <td className={styles.itemqty}>{item.qty || "Habis"}</td>
                  <td className={styles.itemedit}>
                    <img
                      src="/icons/edit.svg"
                      onClick={() => handleEdit(selectedCategory, item.id)}
                      alt="Edit"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No items found for {selectedCategory}.</p>
      )}

      {/* Modal for editing item */}
      {isEditing && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <span className={styles.modalClose} onClick={handleClose}>
              <img src="/icons/x-circle.svg" alt="X" />
            </span>
            Ubah Menu {form.name}
          </div>
          <div className={styles.modalContent}>
            <span className={styles.modalContentList}>
              <p>Nama :</p>
              <input
                className={styles.modalInput}
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Name"
              />
            </span>
            <span className={styles.modalContentList}>
              <p>Harga :</p>
              <p id={styles.rp}>Rp.</p>
              <input
                className={styles.modalInput}
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Price"
              />
            </span>
            <span className={styles.modalContentList}>
              <p>Stock :</p>
              <input
                className={styles.modalInput}
                type="number"
                value={form.qty}
                onChange={(e) => handleChange("qty", e.target.value)}
                placeholder="Stock"
              />
            </span>
            <button
              className={`${styles.modalButton} ${styles.modalButtonSave}`}
              onClick={() => handleSave(isEditing.category, isEditing.id)}
            >
              Save
            </button>
            <button
              className={`${styles.modalButton} ${styles.modalButtonCancel}`}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
