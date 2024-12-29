import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "./apiconfig";
import styles from "./summary.module.css"; // Import the CSS Module

const Summary = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [total, setTotal] = useState(0);
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
        const response = await axios.get(`${URL_API}/today-orders`);
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
    if (price == null) return ""; // Handle null or undefined prices
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className={styles.SummaryContent}>
      <h1 className={styles.Title}>Laporan Keuangan Hari Ini</h1>
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
    </div>
  );
};

export default Summary;
