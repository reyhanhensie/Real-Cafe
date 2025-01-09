import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./apiconfig";
import style from "./Expense.module.css";

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
  const [isSelectingShift, setisSelectingShift] = useState(false); // Modal visibility
  const [shifts, setShifts] = useState([]);
  const [hasfilter, sethasfilter] = useState(false);

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
  const [timeStart, setTimeStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract one day
    return today.toISOString().split("T")[0];
  });
  const [timeEnd, setTimeEnd] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const filterShifts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/ShiftSummary?start_time=${timeStart}&end_time=${timeEnd}`
      );
      setShifts(response.data);
      sethasfilter(true);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };
  const ConstantPriceFormat = (price) => {
    if (price == null || price === 0) return "Rp. 0"; // Handle null or undefined prices
    return "Rp. " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const OrderFilter = async (start, end) => {
    try {
      const response = await axios.get(
        `${API_URL}/ShiftSpendingFilter/?start_time=${start}&end_time=${end}`
      );
      setSpending(response.data);

      // Calculate total price for all orders
      const totalPrice = response.data.reduce(
        (acc, order) => acc + parseFloat(order.total),
        0
      );
      setTotal(totalPrice);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
    setisSelectingShift(false);
  };
    useEffect(() => {
    // Fetch shifts data when the modal opens
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${API_URL}/Shift`);
        if (!hasfilter) {
          setShifts(response.data);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    if (isSelectingShift) {
      fetchShifts();
    }
  }, [isSelectingShift]);

  return (
    <div className={style.pengeluaran}>
      <div className={style.Header}>
        <div>
          <h1>Pengeluaran</h1>
          <button
            className={style.FinishShiftButton}
            onClick={() => setisSelectingShift(true)}
          >
            Pilih Shift
          </button>
        </div>
      </div>

      <table className={style.MainTable}>
        <thead>
          <tr>
            <th>Deskripsi</th>
            <th>Total</th>
            <th>Jam</th>
          </tr>
        </thead>
        <tbody>
          {spending.map((item) => (
            <tr key={item.id}>
              <td>{item.deskripsi}</td>
              <td>Rp. {PriceFormat(item.total)}</td>
              <td>{FormatDate(item.created_at)}</td>
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
      {isSelectingShift && (
        <div className={style.Printing}>
          <div className={style.ShiftContent}>
            <div className={style.filters}>
              <h2>Pilih Jadwal</h2>
              <div>
                <label htmlFor="timeStart">Mulai :</label>
                <input
                  type="date"
                  id="timeStart"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="timeEnd">Selesai :</label>
                <input
                  type="date"
                  id="timeEnd"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </div>
              <button className={style.Apply} onClick={filterShifts}>
                Apply
              </button>
            </div>
            <table className={style.Table}>
              <thead>
                <tr>
                  <th className={style.printingHeader}>Mulai</th>
                  <th className={style.printingHeader}>Selesai</th>
                  <th className={style.printingHeader}>Nama</th>
                  <th className={style.printingHeader}>Shift</th>
                  <th className={style.printingHeader}>Penjualan</th>
                  <th className={style.printingHeader}>Pengeluaran</th>
                  <th className={style.printingHeader}>Pilih</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                    <td>{shift.nama}</td>
                    <td>{shift.shift}</td>
                    <td>{ConstantPriceFormat(shift.omset)}</td>
                    <td>{ConstantPriceFormat(shift.pengeluaran)}</td>
                    <td>
                      <button
                        className={style.PrintButton}
                        onClick={() =>
                          OrderFilter(shift.start_time, shift.end_time)
                        }
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className={style.CloseButton}
              onClick={() => setisSelectingShift(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pengeluaran;
