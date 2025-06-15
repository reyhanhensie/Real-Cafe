import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "../../apiconfig";
import styles from "./Shift.module.css"; // Import the CSS Module

const Shift = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [total, setTotal] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [qrisTotal, setQrisTotal] = useState(0);
  const [shiftSpending, setShiftSpending] = useState(0); // Pengeluaran from API
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isPrintingShift, setIsPrintingShift] = useState(false); // Modal visibility
  const [shifts, setShifts] = useState([]);
  const [kasirName, setKasirName] = useState("");
  const [uangLaci, setUangLaci] = useState("");
  const [Id, setId] = useState(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [form, setForm] = useState({ message: "" });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    orderId: null,
  });
  const [error, setError] = useState(null);


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

  useEffect(() => {
    // Fetch orders and spending data from the API
    const fetchData = async () => {
      try {
        const orderResponse = await axios.get(`${URL_API}/ShiftOrder`);
        setOrders(orderResponse.data);

        // Calculate total price for all orders
        const totalPrice = orderResponse.data.reduce(
          (acc, order) => acc + parseFloat(order.total_price),
          0
        );
        setTotal(totalPrice);

        const cashTotal = orderResponse.data
          .filter(order => order.qris === 0 || order.qris === false) // make sure you check both 1 or true
          .reduce((acc, order) => acc + parseFloat(order.total_price), 0);
        setCashTotal(cashTotal);

        const qrisTotal = orderResponse.data
          .filter(order => order.qris === 1 || order.qris === true) // make sure you check both 1 or true
          .reduce((acc, order) => acc + parseFloat(order.total_price), 0);
        setQrisTotal(qrisTotal);

        const spendingResponse = await axios.get(`${URL_API}/ShiftSpending`);
        const shiftSpendingValue = parseFloat(spendingResponse.data);
        setShiftSpending(shiftSpendingValue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleOrderItems = (orderId) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const print = async (orderId) => {
    try {
      const response = await axios.get(`${URL_API}/print/${orderId}`);
      console.log(
        `Print job for order ${orderId} initiated successfully:`,
        response.data
      );
    } catch (error) {
      console.error(`Error printing order ${orderId}:`, error);
    }
  };

  const PriceFormat = (price) => {
    if (price == null || price === 0) return 0; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const ConstantPriceFormat = (price) => {
    if (price == null || price === 0) return "Rp. 0"; // Handle null or undefined prices
    return "Rp. " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFinishShift = async () => {
    try {
      // Send the values to the backend, stripping out the "Rp." from the uangLaci
      const uangLaciValue = parseInt(uangLaci.replace(/[^\d.-]/g, "")); // Strip "Rp." from uangLaci
      const response = await axios.post(`${URL_API}/ShiftChange`, {
        nama: kasirName,
        uang: uangLaciValue, // Send numeric value
      });
      console.log("Shift finished successfully:", response.data);
      setIsModalOpen(false); // Close the modal
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error finishing shift:", error);
    }
  };
  // PRINTING SHIFTS

  useEffect(() => {
    // Fetch shifts data when the modal opens
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${URL_API}/Shift`);
        setShifts(response.data.reverse());
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    if (isPrintingShift) {
      fetchShifts();
    }
  }, [isPrintingShift]);

  const handlePrintShift = async (shiftId) => {
    try {
      const response = await axios.post(`${URL_API}/ShiftPrint`, {
        id: shiftId,
      });
      console.log("Shift print initiated successfully:", response.data);
      setIsPrintingShift(false); // Close the modal after printing
    } catch (error) {
      console.error("Error printing shift:", error);
    }
  };
  const handleEditMessage = (orderId, currentMessage) => {
    setEditingOrderId(orderId);
    setForm({ message: currentMessage });
    setIsEditingMessage(true);
  };
  const handleSaveMessage = async () => {
    try {
      const response = await axios.patch(
        `${URL_API}/order/${editingOrderId}/message`,
        {
          message: form.message,
        }
      );
      console.log("Message updated successfully:", response.data);

      // Update the orders state with the new message
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editingOrderId
            ? { ...order, message: form.message }
            : order
        )
      );
      setIsEditingMessage(false);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleEditQris = async (orderId) => {
    setConfirmationDialog({ isOpen: true, orderId });
  };
  const cancelCompleteOrder = () => {
    setConfirmationDialog({ isOpen: false, orderId: null });
  };
  const confirmCompleteOrder = async () => {
    try {
      await axios.patch(
        `${URL_API}/order/${confirmationDialog.orderId}/qris`
      );
      // Update the QRIS status locally (toggle it)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === confirmationDialog.orderId
            ? { ...order, qris: order.qris === 1 || order.qris === true ? 0 : 1 }
            : order
        )
      );
    } catch (err) {
      console.error("Error Changing Request:", err);
      setError("Error Changing Request");
    }
    setConfirmationDialog({ isOpen: false, orderId: null });
  };

  return (
    <div className={styles.SummaryContent}>
      <div className={styles.Header}>
        <h1 className={styles.Title}>Laporan Penjualan Shift Sekarang</h1>
        <button
          className={styles.FinishShiftButton}
          onClick={() => setIsPrintingShift(true)}
        >
          Print Shift
        </button>
      </div>
      <div className={styles.Content}>

        <table className={styles.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Meja</th>
              <th>Harga</th>
              <th className={styles.qris}>Qris</th>
              <th className={styles.qris}>Edit</th>
              <th>Keterangan</th>
              <th>Edit</th>
              <th>Kasir</th>
              <th>Mulai</th>
              <th>Selesai</th>
              <th className={styles.print}>Print</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  className={styles.list}
                  onClick={() => toggleOrderItems(order.id)}
                >
                  <td>{order.id}</td>
                  <td>{order.meja_no}</td>
                  <td>Rp. {PriceFormat(order.total_price)}</td>
                  <td className={styles.qrisIMG}>
                    {order.qris === 0 ? (
                      <img src="/icons/cross-circle.svg" alt="QRIS Off" />
                    ) : (
                      <img src="/icons/check-circle.svg" alt="QRIS Off" />
                    )}
                  </td>
                  <td className={styles.qrisEditIMG} >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      onClick={() => handleEditQris(order.id)}
                    /></td>
                  <td>{order.message || "-"}</td>
                  <td className={styles.EditIcon}>
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      onClick={() => handleEditMessage(order.id, order.message)}
                    />
                  </td>
                  <td>{order.kasir}</td>
                  <td>{FormatDate(order.created_at)}</td>
                  <td>{FormatDate(order.updated_at)}</td>
                  <td className={styles.print} onClick={() => print(order.id)}>
                    <img src="/icons/print.svg" alt="print" />
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan="6">
                      <ul>
                        {order.items.map((item) => (
                          <li className={styles.ExpandList} key={item.id}>
                            <span className={styles.ExpandDot}>•</span>
                            <span className={styles.ExpandName}>
                              {item.item_name}
                            </span>
                            <span className={styles.ExpandQty}>
                              Qty: {item.quantity}
                            </span>
                            <span className={styles.ExpandPrice}>Price: </span>
                            <span className={styles.ExpandPriceValue}>
                              Rp. {PriceFormat(item.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <h2>Total</h2>
              </td>
              <td colSpan="2">
                <h2>Rp. {PriceFormat(total)}</h2>
              </td>
              <td colSpan="4">
                <button
                  className={styles.FinishShiftButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  Selesai Shift
                </button>
                {/* <button>Print Shift</button> */}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {isPrintingShift && (
        <div className={styles.Printing}>
          <div className={styles.PrintingContent}>
            <h2>PILIH SHIFT UNTUK PRINT</h2>
            <table className={styles.Table}>
              <thead>
                <tr>
                  <th className={styles.printingHeader}>Mulai</th>
                  <th className={styles.printingHeader}>Selesai</th>
                  <th className={styles.printingHeader}>Nama</th>
                  <th className={styles.printingHeader}>Shift</th>
                  <th className={styles.printingHeader}>Print</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                    <td>{shift.nama}</td>
                    <td>{shift.shift}</td>
                    <td>
                      <button
                        className={styles.PrintButton}
                        onClick={() => handlePrintShift(shift.id)}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className={styles.CloseButton}
              onClick={() => setIsPrintingShift(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.Modal}>
          <div className={styles.ModalContent}>
            <h2>Selesai Shift</h2>
            <form className={styles.ModalForm} onSubmit={(e) => e.preventDefault()}>
              <label>
                Kasir:
                <input
                  type="text"
                  value={kasirName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      // Allow only letters and spaces
                      setKasirName(value);
                    }
                  }}
                  required
                />
              </label>

              <label>
                Cash Penjualan:
                <input
                  type="text"
                  value={ConstantPriceFormat(cashTotal)}
                  readOnly
                />
              </label>
              <label>
                Qris Penjualan:
                <input
                  type="text"
                  value={ConstantPriceFormat(qrisTotal)}
                  readOnly
                />
              </label>
              <label>
                Total Penjualan:
                <input
                  type="text"
                  value={ConstantPriceFormat(total)}
                  readOnly
                />
              </label>
              <label>
                Pengeluaran:
                <input
                  type="text"
                  value={ConstantPriceFormat(shiftSpending)}
                  readOnly
                />
              </label>
              <label>
                Total:
                <input
                  type="text"
                  value={ConstantPriceFormat(total - shiftSpending)}
                  required
                />
              </label>
              <label>
                Uang Laci Seharusnya:
                <input
                  type="text"
                  value={ConstantPriceFormat(cashTotal - shiftSpending)}
                  required
                />
              </label>
              <label>
                Uang Laci di Kasir:
                <input
                  type="text"
                  value={uangLaci}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only numbers
                      setUangLaci(value);
                    }
                  }}
                  required
                />
              </label>
              <button onClick={handleFinishShift}>Submit</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {isEditingMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Keterangan</h2>
              <span
                className={styles.modalClose}
                onClick={() => setIsEditingMessage(false)}
              >
                <img src="/icons/x-circle.svg" alt="Close" />
              </span>
            </div>
            <div className={styles.modalBody}>
              <label htmlFor="messageInput">Keterangan:</label>
              <input
                type="text"
                id="messageInput"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.modalButton} ${styles.modalButtonSave}`}
                onClick={handleSaveMessage}
              >
                Save
              </button>
              <button
                className={`${styles.modalButton} ${styles.modalButtonCancel}`}
                onClick={() => setIsEditingMessage(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmationDialog.isOpen && (
        <div className="confirmation-dialog">
          <p>Ganti Status QRIS?</p>
          <div className="confirmation-buttons">
            <button onClick={cancelCompleteOrder} className="cancel-button">
              Cancel
            </button>
            <button
              onClick={confirmCompleteOrder}
              className="confirm-button"
            >
              Iya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shift;
