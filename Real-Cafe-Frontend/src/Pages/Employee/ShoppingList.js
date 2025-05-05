import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../apiconfig";
import style from "./ShoppingList.module.css";
import style1 from "./ShoppingList.style1.module.css";

const ShoppingList = () => {
  const [spending, setSpending] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
  });
  const [editData, setEditData] = useState({
    item: "",
    price: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState("");

  const [formCategoryData, setFormCategoryData] = useState({
    name: "",
  });
  const [Categories, setCategories] = useState([]);

  // For Shopping Items Modal
  const [shoppingItems, setShoppingItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingShoppingItem, setIsCreatingShoppingItem] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

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
      const response1 = await axios.get(`${API_URL}/shopping-items`);
      const response2 = await axios.get(`${API_URL}/categories`);
      setShoppingItems(response1.data);
      setCategories(response2.data); // Assuming categories are part of the response
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching shopping items:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModalCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      setIsCreatingCategory(true);
    } catch (error) {
      console.error("Error fetching shopping items:", error);
    }
  };

  const handleInputCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormCategoryData({ ...formCategoryData, [name]: value });
  };

  const HandleSumbitCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/categories`, formCategoryData);
      if (response.data && response.data.id) {
        setCategories((prevCategories) => [...prevCategories, response.data]);
        setFormCategoryData({ name: "" }); // Reset formCategoryData after submission
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }
  const HandleSubmitShoppingItem = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log(parseInt(formData.category_id));

    try {
      const response = await axios.post(`${API_URL}/shopping-item`, formData);
      if (response.data && response.data.id) {
        setShoppingItems((prev) => [...prev, response.data]);
        setFormData({ name: "" }); // Reset formCategoryData after submission
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }



  return (
    <div className={style.pengeluaran}>
      <div className={style.Header}>
        <div>
          <h1>Total Belanjaan</h1>
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
        <div className={style1.modal_shipping_item}>
          <div className={style1.modalContent_shipping_item}>
            <h3>Shopping Items</h3>
            <div className={style1.modalContent_shipping_itemTitle}>
              <h2>Tambah Daftar</h2>
              <button className={style1.modalContent_add_item_button} onClick={() => setIsCreatingShoppingItem(true)}>
                <img
                  src={"/icons/plus-solid2.svg"}
                  alt="Add Icon"
                  className={style1.modalContent_add_item}
                />
              </button>
            </div>
            <div className={style1.modalContent_shipping_item_list}>
              <h2>Daftar Belanja</h2>
              <ul>
                {shoppingItems.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>

            <button className={style1.modal_shipping_item_close} onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      {isCreatingShoppingItem && (
        <div className={style1.modal_add_shipping_item_form}>
          <div className={style1.modalContent_add_shipping_item_form}>
            <button className={style1.modalContent_close_button} onClick={() => setIsCreatingShoppingItem(false)}>
              <img
                src={"/icons/x-circle.svg"}
                alt="Close"
                className={style1.modalContent_close_icon}
              />
            </button>
            <h2>Tambah Daftar Belanja</h2>

            <div className={style1.modalContent_add_shipping_item_InputForm_Container}>
              <div className={style1.modalContent_add_shipping_item_InputForm}>
                <label>Nama :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama Barang"
                />
                <label>Kategori :</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value === "" ? "" : parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">-- Pilih Kategori --</option>
                  {Categories.map((Categories) => (
                    <option key={Categories.id} value={Categories.id}>
                      {Categories.name}
                    </option>
                  ))}
                </select>
                {formData.category_id === "" || formData.name === "" ? (
                  <button disabled>Simpan</button>

                ) : (
                  <button
                    onClick={HandleSubmitShoppingItem}>Simpan</button>
                )}

              </div>

              <div className={style1.modalContent_add_shipping_item_InputForm2}>
                <label>Tambah Kategori</label>
                <button onClick={() => handleOpenModalCategory()}>
                  <img
                    src={"/icons/add-menu.svg"}
                    alt="Close"
                    className={style1.modalContent_add_category_icon}
                  />
                </button>
              </div>
            </div>
            <h2>Daftar Menu Belanja</h2>
            <ul>
              {shoppingItems.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isCreatingCategory && (
        <div className={style1.modal_category_form}>
          <div className={style1.modalContent_category_form}>
            <button className={style1.modalContent_close_button} onClick={() => setIsCreatingCategory(false)}>
              <img
                src={"/icons/x-circle.svg"}
                alt="Close"
                className={style1.modalContent_close_icon}
              />
            </button>
            <h2>Tambah Kategori</h2>
            <div className={style1.modalContent_category_input_form}>
              <label>Kategori :</label>
              <input
                type="text"
                name="name"
                value={formCategoryData.name}
                onChange={handleInputCategoryChange}
                placeholder="Ketik Kategori"
                required
              />
              <button onClick={HandleSumbitCategory}>Simpan</button>
            </div>
            <h3>Kategori Tersedia</h3>
            <ul>
              {Categories.map((item) => (
                <li className={style1.CategoriesList} key={item.id}>{item.name}

                  {/* NANTI */}
                  {/* <div className={style1.CategoriesListButton}>
                    <button onClick={null }>Edit</button>
                    <button onClick={null }>Hapus</button>
                  </div> */}

                </li>
              ))}
            </ul>
          </div>
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
