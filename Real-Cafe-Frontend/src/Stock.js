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
  Paket: "Paket",
};

const MenuEditor = () => {
  const [menu, setMenu] = useState({});
  const [isEditing, setIsEditing] = useState(null); // Track which item is being edited
  const [isDeleting, setIsDeleting] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Track whether we are adding a new item
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

  const handleDelete = (category, id) => {
    const item = menu[category].find((item) => item.id === id);
    setForm({ name: item.name });
    setIsDeleting({ category, id });
  };

  const handleConfirmDelete = (category, id) => {
    const sanitizedCategory = category.replace(/\s+/g, "");

    axios
      .delete(`${API_URL}/${sanitizedCategory}/${id}`)
      .then((response) => {
        // Update the state with the modified item
        setMenu((prevMenu) => ({
          ...prevMenu,
          [category]: prevMenu[category].filter((item) => item.id !== id),
        }));

        // Reset the editing state
        handleClose(null);
      })
      .catch((error) => console.error(error));
  };

  const handleSave = (category, id) => {
    const sanitizedCategory = category.replace(/\s+/g, "");
    const updatedItem = { ...form }; // Prepare the updated item from the form data

    axios
      .put(`${API_URL}/${sanitizedCategory}/${id}`, updatedItem)
      .then((response) => {
        const updatedData = response.data.data || updatedItem;

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
    // If the field is 'name', restrict the length to 21 characters
    if (field === "name" && value.length <= 21) {
      setForm((prevForm) => ({ ...prevForm, [field]: value }));
    } else if (field !== "name") {
      setForm((prevForm) => ({ ...prevForm, [field]: value }));
    }
  };
  const handleClose = () => {
    setIsEditing(null);
    setIsAdding(false); // Close the add item modal as well
    setIsDeleting(null);
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

  const PriceFormat = (price) => {
    if (price == null) return ""; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
      {menu[selectedCategory] ? (
        <div className={styles.stockList}>
          <div className={styles.stockHeader}>
            <h2 id={styles.categoryHeader}>{selectedCategory}</h2>

            <h2>Tambah Item</h2>
            <button
              className={styles.addButton}
              onClick={() => setIsAdding(true)}
            >
              <img
                className={styles.addButton}
                src="/icons/add-menu.svg"
                alt="add menu"
              />
            </button>
          </div>
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
                  <td className={styles.itemprice}>Rp. {PriceFormat(item.price)}</td>
                  <td className={styles.itemqty}>{item.qty || "Habis"}</td>
                  <td className={styles.itemAction}>
                    <img
                      src="/icons/edit.svg"
                      onClick={() => handleEdit(selectedCategory, item.id)}
                      alt="Edit"
                    />
                    <img
                      className={styles.itemdelete}
                      src="icons/x-circle.svg"
                      alt="delete"
                      onClick={() => handleDelete(selectedCategory, item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Add Item Button */}
        </div>
        //DISABLED IF ITEMS NOT EXITS
      ) 
      : (
        <p>No items found for {selectedCategory}.</p>
      )
      }
      {isDeleting && (
        <div className={styles.deleteBox}>
          <div className={styles.deleteHeader}>
            <h2>Yakin Hapus Menu {form.name} ?</h2>
            <div className={styles.deleteConfirmation}>
              <button
                className={styles.deleteYes}
                onClick={() =>
                  handleConfirmDelete(isDeleting.category, isDeleting.id)
                }
              >
                <img src="/icons/checkmark.svg" alt="YES" />
              </button>
              <button className={styles.deleteNo} onClick={() => handleClose()}>
                <img src="/icons/x-circle.svg" alt="NO" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing item */}
      {(isEditing || isAdding) && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <span className={styles.modalClose} onClick={handleClose}>
              <img src="/icons/x-circle.svg" alt="Close" />
            </span>
            {isAdding ? "Tambah Menu" : `Ubah Menu ${form.name}`}
          </div>
          <div className={styles.modalContent}>
            <span className={styles.modalContentList}>
              <p>Nama :</p>
              <input
                className={styles.modalInput}
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nama Menu"
                maxLength={21} // Limit to 21 characters
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
                placeholder="Harga"
              />
            </span>
            <span className={styles.modalContentList}>
              <p>Stock :</p>
              <input
                className={styles.modalInput}
                type="number"
                value={form.qty}
                onChange={(e) => handleChange("qty", e.target.value)}
                placeholder="Stok"
              />
            </span>
            <button
              className={`${styles.modalButton} ${styles.modalButtonSave}`}
              onClick={
                isAdding
                  ? handleAddItem
                  : () => handleSave(isEditing.category, isEditing.id)
              }
            >
              {isAdding ? "Tambah" : "Save"}
            </button>
            <button
              className={`${styles.modalButton} ${styles.modalButtonCancel}`}
              onClick={handleClose}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
