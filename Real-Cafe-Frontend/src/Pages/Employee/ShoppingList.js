import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../apiconfig";
import style from "./ShoppingList.module.css";

const ShoppingList = () => {
  const [spending, setSpending] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    item: "",
    price: "",
  });
  const [editData, setEditData] = useState({
    item: "",
    price: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState("");

  // For Shopping Items Modal
  const [shoppingItems, setShoppingItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingShoppingItem, setIsCreatingShoppingItem] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);


  useEffect(() => {
    const fetchSpending = async () => {
      try {
        const response = await axios.get(`${API_URL}/shopping-list`);
        setSpending(response.data);
        const totalAmount = response.data.reduce(
          (acc, item) => acc + parseFloat(item.price || 0),
          0
        );
        setTotal(totalAmount);
      } catch (error) {
        console.error("Error fetching spending data:", error);
      }
    };

    fetchSpending();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/shopping-list`, formData);
      setSpending([...spending, response.data]);
      setFormData({ item: "", price: "" });
      setTotal((prevTotal) => prevTotal + parseFloat(formData.price || 0));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditData({
      item: item.item,
      price: item.price,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.item || !editData.price) {
      setError("Both fields are required");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/shopping-list/${editingItem.id}`,
        editData
      );
      const updatedSpending = spending.map((item) =>
        item.id === editingItem.id ? { ...item, ...editData } : item
      );
      setSpending(updatedSpending);

      // Update total
      const newTotal = updatedSpending.reduce(
        (acc, item) => acc + parseFloat(item.price || 0),
        0
      );
      setTotal(newTotal);

      setEditingItem(null);
      setEditData({ item: "", price: "" });
      setError("");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/shopping-list/${id}`);
      const updatedSpending = spending.filter((item) => item.id !== id);
      setSpending(updatedSpending);

      const newTotal = updatedSpending.reduce(
        (acc, item) => acc + parseFloat(item.price || 0),
        0
      );
      setTotal(newTotal);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const PriceFormat = (price) => {
    if (price == null) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const FormatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-GB", options).replace(",", "");
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditData({ item: "", price: "" });
    setError("");
  };

  // Open/close modal for shopping items
  const handleOpenModal = async () => {
    try {
      const response = await axios.get(`${API_URL}/shopping-items`);
      setShoppingItems(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching shopping items:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className={style.pengeluaran}>
      <div className={style.Header}>
        <div>
          <h1>Pengeluaran</h1>
          <h2>Total - Rp. {PriceFormat(total)}</h2>
        </div>

        {/* New Button to open Shopping Items Modal */}
        <button onClick={handleOpenModal}>View Shopping Items</button>

        <div className={style.Form}>
          <form className={style.FormHeader} onSubmit={handleSubmit}>
            <div className={style.FormDescription}>
              <label>Deskripsi :</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                placeholder="Masukkan Deskripsi"
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
            <div className={style.FormTotal}>
              <label>Total :</label>
              <p className={style.FormInputNominal}>
                Rp.
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Masukkan Nominal"
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
              </p>
            </div>
            <button type="submit">Tambah Pengeluaran</button>
          </form>
        </div>
      </div>

      {/* Modal for shopping items */}
      {isModalOpen && (
        <div className={style.modal_shipping_item}>
          <div className={style.modalContent_shipping_item}>
            <h3>Shopping Items</h3>
            <div className={style.modalContent_shipping_itemTitle}>
              <div className={style.categoryWrapper}>
                <select name="category_id">…</select>
                <button onClick={() => setIsCreatingCategory(true)}>
                  <img src="/icons/plus.svg" alt="Add Category" />
                </button>
              </div>
              <h2>Tambah Daftar Belanja</h2>
              <button className={style.modalContent_add_item_button} onClick={null}>
                <img
                  src={"/icons/plus-solid2.svg"}
                  alt="Add Icon"
                  className={style.modalContent_add_item}
                />
              </button>
            </div>
            <ul>
              {shoppingItems.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
            <button className={style.modal_shipping_item_close} onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      {isCreatingCategory && (
        <div className={style.modal_category_form}>
          <div className={style.modalContent_category_form}>
            <h3>Shopping Items</h3>
            <div className={style.modalContent_shipping_itemTitle}>
              <div className={style.categoryWrapper}>
                <select name="category_id">…</select>
                <button onClick={() => setIsCreatingCategory(true)}>
                  <img src="/icons/plus.svg" alt="Add Category" />
                </button>
              </div>
              <h2>Tambah Daftar Belanja</h2>
              <button className={style.modalContent_add_item_button} onClick={null}>
                <img
                  src={"/icons/plus-solid2.svg"}
                  alt="Add Icon"
                  className={style.modalContent_add_item}
                />
              </button>
            </div>
            <ul>
              {shoppingItems.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
            <button className={style.modal_shipping_item_close} onClick={handleCloseModal}>Close</button>
          </div>
          <input
            value={null}
            onChange={null}
            placeholder="Nama Kategori"
          />
          <button onClick={null}>Save</button>
          <button onClick={() => setIsCreatingCategory(false)}>Cancel</button>
        </div>
      )}
      {isCreatingCategory && (
        <div className={style.modal_category_form}>
          <div className={style.modalContent_category_form}>
            <h3>Shopping Items</h3>
            <div className={style.modalContent_shipping_itemTitle}>
              <div className={style.categoryWrapper}>
                <select name="category_id">…</select>
                <button onClick={() => setIsCreatingCategory(true)}>
                  <img src="/icons/plus.svg" alt="Add Category" />
                </button>
              </div>
              <h2>Tambah Daftar Belanja</h2>
              <button className={style.modalContent_add_item_button} onClick={null}>
                <img
                  src={"/icons/plus-solid2.svg"}
                  alt="Add Icon"
                  className={style.modalContent_add_item}
                />
              </button>
            </div>
            <ul>
              {shoppingItems.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
            <button className={style.modal_shipping_item_close} onClick={handleCloseModal}>Close</button>
          </div>
          <input
            value={null}
            onChange={null}
            placeholder="Nama Kategori"
          />
          <button onClick={null}>Save</button>
          <button onClick={() => setIsCreatingCategory(false)}>Cancel</button>
        </div>
      )}


      <table>
        <thead>
          <tr>
            <th>Deskripsi</th>
            <th>Total</th>
            <th>Jam</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {spending.map((item) => (
            <tr key={item.id}>
              <td>{item.item}</td>
              <td>Rp. {PriceFormat(item.price)}</td>
              <td>{FormatDate(item.created_at)}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>Rp. {PriceFormat(total)}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      {editingItem && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Edit Pengeluaran</h3>
            <form className={style.ModalForm} onSubmit={handleEditSubmit}>
              <div className={style.ModalFormDescription}>
                <label>Deskripsi :</label>
                <input
                  type="text"
                  name="deskripsi"
                  value={editData.item}
                  onChange={(e) =>
                    setEditData({ ...editData, item: e.target.value })
                  }
                  required
                  autoComplete="off"
                />
              </div>
              <div className={style.ModalFormTotal}>
                <label>Total :</label>
                <p>
                  Rp.{" "}
                  <input
                    type="number"
                    name="total"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    required
                    autoComplete="off"
                  />
                </p>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit">Update</button>
              <button type="button" onClick={handleCloseEdit}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
