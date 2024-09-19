import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "./apiconfig";

const Summary = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [total, setTotal] = useState(0);

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

  return (
    <div>
      <h1>Today's Orders Summary</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Meja No</th>
            <th>Total Price</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr onClick={() => toggleOrderItems(order.id)}>
                <td>{order.id}</td>
                <td>{order.meja_no}</td>
                <td>{order.total_price}</td>
                <td>{order.message || "-"}</td>
              </tr>
              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan="4">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.item_name} - Quantity: {item.quantity}, Price:{" "}
                          {item.price}
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
              <strong>Total</strong>
            </td>
            <td colSpan="2">
              <strong>{total}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Summary;
