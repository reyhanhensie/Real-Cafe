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
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [error, setError] = useState(null);

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
    setFormData({ deskripsi: item.deskripsi, total: item.total });
    setEditingId(item.id);
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
  const handleClose = () => {
    setIsAdding(null);
    setIsEditing(null);

    setFormData({ deskripsi: "", total: "" });
  };

  return (
    <div className={style.pengeluaran}>
      <h1>Pengeluaran</h1>
      <h2>Total - Rp. {total}</h2>
      {/* Spending Form */}
      {(isAdding || isEditing) && (
        <div className={style.form}>
          <div className={style.formHeader}>
            <span className={style.formClose} onClick={handleClose}></span>
            <img src="/icons/x-circle.svg" alt="Close" />
            {isAdding ? "Tambah Pengeluaran" : "Ubah Pengeluaran"}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Deskripsi:</label>
          <input
            type="text"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Total:</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">
          {editingId ? "Update" : "Tambah Pengeluaran"}
        </button>
        {editingId && (
          <button onClick={() => setEditingId(null)}>Cancel Edit</button>
        )}
      </form>

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
              <td>{item.total}</td>
              <td>{FormatDate(item.created_at)}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
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
              <strong>{total}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Pengeluaran;
