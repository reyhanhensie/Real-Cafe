import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./apiconfig";
import style from "./Pengeluaran.module.css";

const Pengeluaran = () => {
  const [spending, setSpending] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    deskripsi: "",
    total: "",
  });
  const [editData, setEditData] = useState({
    deskripsi: "",
    total: "",
  });

  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Track which item is being edited

  useEffect(() => {
    // Fetch spending data from the API
    const fetchSpending = async () => {
      try {
        const response = await axios.get(`${API_URL}/Spending`);
        setSpending(response.data);

        // Calculate total amount
        const totalAmount = response.data.reduce(
          (acc, item) => acc + parseFloat(item.total),
          0
        );
        setTotal(totalAmount);
      } catch (error) {
        console.error("Error fetching spending data:", error);
      }
    };

    fetchSpending();
  }, []);

  // Handle form submission for adding or updating spending
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        // Update existing spending
        const response = await axios.put(
          `${API_URL}/Spending/${editingId}`,
          formData
        );
        setSpending((prevSpending) =>
          prevSpending.map((item) =>
            item.id === editingId ? response.data : item
          )
        );
      } else {
        // Add new spending
        const response = await axios.post(`${API_URL}/Spending`, formData);
        setSpending((prevSpending) => [...prevSpending, response.data]);
        setTotal((prevTotal) => prevTotal + parseFloat(formData.total));
      }

      // Reset form data
      setFormData({ deskripsi: "", total: "" });
      setEditingId(null);
    } catch (error) {
      setError("Error submitting the form. Please try again.");
      console.error("Error submitting spending:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle delete spending
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/Spending/${id}`);
      setSpending((prevSpending) =>
        prevSpending.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error deleting spending:", error);
    }
  };

  // Handle edit spending
  const handleEdit = (item) => {
    setEditData({ deskripsi: item.deskripsi, total: item.total });
    setEditingItem(item);
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
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/Spending/${editingItem.id}`,
        editData
      );
      setSpending((prevSpending) =>
        prevSpending.map((item) =>
          item.id === editingItem.id ? response.data : item
        )
      );
      setEditingItem(null); // Close modal
      setFormData({ deskripsi: "", total: "" });
    } catch (error) {
      setError("Error updating the item. Please try again.");
      console.error("Error updating spending:", error);
    }
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setFormData({ deskripsi: "", total: "" });
  };
  const PriceFormat = (price) => {
    if (price == null) return ""; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className={style.pengeluaran}>
      <div className={style.Header}>
        <div>
          <h1>Pengeluaran</h1>
          <h2>Total - Rp. {PriceFormat(total)}</h2>
        </div>
        <div className={style.Form}>
          <form className={style.FormHeader} onSubmit={handleSubmit}>
            <div className={style.FormDescription}>
              <label>Deskripsi :</label>
              <input
                type="text"
                name="deskripsi"
                value={formData.deskripsi}
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
                  name="total"
                  value={formData.total}
                  placeholder="Masukkan Nominal"
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />{" "}
              </p>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Tambah Pengeluaran</button>
          </form>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Deskripsi</th>
            <th>Total</th>
            <th>Jam</th>
            <th>Ubah</th>
          </tr>
        </thead>
        <tbody>
          {spending.map((item) => (
            <tr key={item.id}>
              <td>{item.deskripsi}</td>
              <td>RP. {PriceFormat(item.total)}</td>
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
      {/* Modal for Editing */}
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
                  value={editData.deskripsi}
                  onChange={(e) =>
                    setEditData({ ...editData, deskripsi: e.target.value })
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
                    value={editData.total}
                    onChange={(e) =>
                      setEditData({ ...editData, total: e.target.value })
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

export default Pengeluaran;
