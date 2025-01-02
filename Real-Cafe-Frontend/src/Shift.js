import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "./apiconfig";
import styles from "./Shift.module.css"; // Import the CSS Module

const Shift = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [total, setTotal] = useState(0);
  const [shiftSpending, setShiftSpending] = useState(0); // Pengeluaran from API
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [kasirName, setKasirName] = useState("");
  const [uangLaci, setUangLaci] = useState("");

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
    } catch (error) {
      console.error("Error finishing shift:", error);
    }
  };

  return (
    <div className={styles.SummaryContent}>
      <div className={styles.Header}>
        <h1 className={styles.Title}>Laporan Penjualan Shift Sekarang</h1>
        <button
          className={styles.FinishShiftButton}
          onClick={() => setIsModalOpen(true)}
        >
          Selesai Shift
        </button>
      </div>

      <table className={styles.Table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Meja</th>
            <th>Harga</th>
            <th>Keterangan</th>
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
                <td>{order.message || "-"}</td>
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
          </tr>
        </tfoot>
      </table>

      {isModalOpen && (
        <div className={styles.Modal}>
          <div className={styles.ModalContent}>
            <h2>Selesai Shift</h2>
            <form onSubmit={(e) => e.preventDefault()}>
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
                Penjualan:
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
                  value={ConstantPriceFormat(total-shiftSpending)}
                  required
                />
              </label>
              <label>
                Uang Laci:
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
    </div>
  );
};

export default Shift;
