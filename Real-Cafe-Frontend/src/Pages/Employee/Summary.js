import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "../../apiconfig";
import styles from "./summary.module.css"; // Import the CSS Module

const Summary = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [total, setTotal] = useState(0);
  const [shifts, setShifts] = useState([]);
  const [isSelectingShift, setisSelectingShift] = useState(false); // Modal visibility
  const [hasfilter, sethasfilter] = useState(false);
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
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${URL_API}/ShiftOrder`);
        setOrders(response.data);

        // Calculate total price for all orders
        const totalPrice = response.data.reduce(
          (acc, order) => acc + parseFloat(order.total_price),
          0
        );
        setTotal(totalPrice);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Fetch shifts data when the modal opens
    const fetchShifts = async () => {
      try {
        const response = await axios.get(`${URL_API}/Shift`);
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

  // Fetch shifts data when the modal opens
  const filterShifts = async () => {
    try {
      const response = await axios.get(
        `${URL_API}/ShiftSummary?start_time=${timeStart}&end_time=${timeEnd}`
      );
      setShifts(response.data);
      sethasfilter(true);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const [timeStart, setTimeStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract one day
    return today.toISOString().split("T")[0];
  });
  const [timeEnd, setTimeEnd] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const PriceFormat = (price) => {
    if (price == null) return ""; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const ConstantPriceFormat = (price) => {
    if (price == null || price === 0) return "Rp. 0"; // Handle null or undefined prices
    return "Rp. " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const OrderFilter = async (start, end) => {
    try {
      const response = await axios.get(
        `${URL_API}/ShiftOrderFilter/?start_time=${start}&end_time=${end}`
      );
      setOrders(response.data);

      // Calculate total price for all orders
      const totalPrice = response.data.reduce(
        (acc, order) => acc + parseFloat(order.total_price),
        0
      );
      setTotal(totalPrice);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
    setisSelectingShift(false);
  };

  return (
    <div className={styles.SummaryContent}>
      <div className={styles.Header}>
        <h1 className={styles.Title}>Laporan Shift</h1>
        <button
          className={styles.FinishShiftButton}
          onClick={() => setisSelectingShift(true)}
        >
          Pilih Shift
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
            {/* <th className={styles.print}>Print</th> */}
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
      {isSelectingShift && (
        <div className={styles.Printing}>
          <div className={styles.ShiftContent}>
            <div className={styles.filters}>
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
              <button className={styles.Apply} onClick={filterShifts}>
                Apply
              </button>
            </div>
            <table className={styles.Table}>
              <thead>
                <tr>
                  <th className={styles.printingHeader}>Mulai</th>
                  <th className={styles.printingHeader}>Selesai</th>
                  <th className={styles.printingHeader}>Nama</th>
                  <th className={styles.printingHeader}>Shift</th>
                  <th className={styles.printingHeader}>Penjualan</th>
                  <th className={styles.printingHeader}>Pengeluaran</th>
                  <th className={styles.printingHeader}>Pilih</th>
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
                        className={styles.PrintButton}
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
              className={styles.CloseButton}
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

export default Summary;
